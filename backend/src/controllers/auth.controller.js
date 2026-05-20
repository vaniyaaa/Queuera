const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');
const ConnectedAccount = require('../models/ConnectedAccount.js');
const ScheduledPost = require('../models/ScheduledPost.js');
const { JWT_SECRET } = require('../config/env.js');
const {
  getAuthUrl,
  exchangeCodeForToken,
  getLongLivedToken,
  getUserPages,
} = require('../services/meta.service.js');
const {
  getAuthUrl: getLinkedInAuthUrl,
  exchangeCodeForToken: exchangeLinkedInCodeForToken,
  getLinkedInProfile,
} = require('../services/linkedin.service.js');
const { encryptToken } = require('../services/token.service.js');
const { sendSuccess } = require('../utils/response.js');
const { FRONTEND_URL } = require('../config/env.js');

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      next({ status: 409, message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
    });

    return sendSuccess(res, { id: user._id, email: user.email }, 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      next({ status: 401, message: 'Invalid credentials' });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      next({ status: 401, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.cookie('queuera_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return sendSuccess(res, { id: user._id, email: user.email }, 200);
  } catch (err) {
    next(err);
  }
}

async function facebookConnect(req, res, next) {
  try {
    const stateToken = jwt.sign(
      { userId: req.user.userId },
      JWT_SECRET,
      { expiresIn: '10m' },
    );
    const url = getAuthUrl(stateToken);
    return sendSuccess(res, { url }, 200);
  } catch (err) {
    next(err);
  }
}

async function facebookCallback(req, res, next) {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/oauth/callback?status=error&message=Authorization+code+missing`);
    }

    let userId;
    try {
      const decoded = jwt.verify(state, JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.redirect(`${FRONTEND_URL}/oauth/callback?status=error&message=Invalid+state+parameter`);
    }

    const shortLived = await exchangeCodeForToken(code);
    const longLived = await getLongLivedToken(shortLived.access_token);
    const pagesPayload = await getUserPages(longLived.access_token);
    const pageList = Array.isArray(pagesPayload.data) ? pagesPayload.data : [];

    for (const page of pageList) {
      await ConnectedAccount.findOneAndUpdate(
        { userId, platformAccountId: String(page.id), platform: 'FACEBOOK' },
        {
          userId,
          platform: 'FACEBOOK',
          platformAccountId: String(page.id),
          platformAccountName: page.name ?? '',
          accessToken: encryptToken(page.access_token),
          scope: 'w_member_social,r_liteprofile',
          isActive: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      const ig = page.instagram_business_account;
      if (ig && ig.id) {
        await ConnectedAccount.findOneAndUpdate(
          { userId, platformAccountId: String(ig.id), platform: 'INSTAGRAM' },
          {
            userId,
            platform: 'INSTAGRAM',
            platformAccountId: String(ig.id),
            platformAccountName: page.name + ' (Instagram)',
            accessToken: encryptToken(page.access_token),
            scope: 'instagram_basic,instagram_content_publish',
            isActive: true,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      }
    }

    return res.redirect(`${FRONTEND_URL}/oauth/callback?status=success&platform=facebook&pages=${pageList.length}`);
  } catch (err) {
    console.error('LinkedIn callback error:', err.message, err?.response?.data);
    return res.redirect(`${FRONTEND_URL}/oauth/callback?status=error&message=LinkedIn+connection+failed`);
  }
}

async function getConnectedAccounts(req, res, next) {
  try {
    const accounts = await ConnectedAccount.find({
      userId: req.user.userId,
    }).select(
      'platform platformAccountId platformAccountName scope isActive createdAt',
    );

    return sendSuccess(res, accounts, 200);
  } catch (err) {
    next(err);
  }
}

async function disconnectAccount(req, res, next) {
  try {
    const accountId = req.params.id;

    const account = await ConnectedAccount.findOne({
      _id: accountId,
      userId: req.user.userId,
    });

    if (!account) {
      next({ status: 404, message: 'Connected account not found' });
      return;
    }

    const pending = await ScheduledPost.findOne({
      connectedAccountId: accountId,
      status: 'QUEUED',
    });

    if (pending) {
      next({
        status: 400,
        message: 'Cannot disconnect account with pending scheduled posts',
      });
      return;
    }

    await ConnectedAccount.findByIdAndDelete(account._id);

    return sendSuccess(res, { message: 'Account disconnected' }, 200);
  } catch (err) {
    next(err);
  }
}

async function linkedInConnect(req, res, next) {
  try {
    const stateToken = jwt.sign(
      { userId: req.user.userId },
      JWT_SECRET,
      { expiresIn: '10m' },
    );
    const url = getLinkedInAuthUrl(stateToken);
    return sendSuccess(res, { url }, 200);
  } catch (err) {
    next(err);
  }
}

async function linkedInCallback(req, res, next) {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/oauth/callback?status=error&message=Authorization+code+missing`);
    }

    let userId;
    try {
      const decoded = jwt.verify(state, JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.redirect(`${FRONTEND_URL}/oauth/callback?status=error&message=Invalid+state+parameter`);
    }

    const tokenPayload = await exchangeLinkedInCodeForToken(code);
    const accessToken = tokenPayload.access_token;
    const profile = await getLinkedInProfile(accessToken);
    const platformAccountName = profile.name;

    await ConnectedAccount.findOneAndUpdate(
      { userId, platformAccountId: String(profile.sub), platform: 'LINKEDIN' },
      {
        userId,
        platform: 'LINKEDIN',
        platformAccountId: String(profile.sub),
        platformAccountName,
        accessToken: encryptToken(accessToken),
        scope: 'w_member_social,profile,email,openid',
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.redirect(`${FRONTEND_URL}/oauth/callback?status=success&platform=linkedin`);
  } catch (err) {
    console.error('[linkedInCallback] failed:', err.message);
    console.error('[linkedInCallback] stack:', err.stack);
    if (err.response) {
      console.error('[linkedInCallback] axios response:', err.response.status, err.response.data);
    }
    return res.redirect(`${FRONTEND_URL}/oauth/callback?status=error&message=LinkedIn+connection+failed`);
  }
}

async function logout(req, res, next) {
  res.clearCookie('queuera_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return sendSuccess(res, { message: 'Logged out successfully' }, 200);
}

module.exports = {
  register,
  login,
  logout,
  facebookConnect,
  facebookCallback,
  getConnectedAccounts,
  disconnectAccount,
  linkedInConnect,
  linkedInCallback,
};
