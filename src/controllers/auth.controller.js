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

    return sendSuccess(res, { token }, 200);
  } catch (err) {
    next(err);
  }
}

async function facebookConnect(req, res, next) {
  try {
    const url = getAuthUrl();
    return sendSuccess(res, { url }, 200);
  } catch (err) {
    next(err);
  }
}

async function facebookCallback(req, res, next) {
  try {
    const { code, state } = req.query;

    if (!code) {
      next({ status: 400, message: 'Authorization code missing' });
      return;
    }

    const shortLived = await exchangeCodeForToken(code);
    const longLived = await getLongLivedToken(shortLived.access_token);
    const pagesPayload = await getUserPages(longLived.access_token);
    const pageList = Array.isArray(pagesPayload.data) ? pagesPayload.data : [];

    const userId = req.user.userId;

    for (const page of pageList) {
      await ConnectedAccount.findOneAndUpdate(
        { userId, platformAccountId: String(page.id), platform: 'FACEBOOK' },
        {
          userId,
          platform: 'FACEBOOK',
          platformAccountId: String(page.id),
          platformAccountName: page.name ?? '',
          accessToken: encryptToken(page.access_token),
          scope:
            'pages_manage_posts,pages_read_engagement,pages_show_list',
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

    return sendSuccess(
      res,
      {
        message: 'Facebook connected successfully',
        pagesConnected: pageList.length,
      },
      200,
    );
  } catch (err) {
    next(err);
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
    const url = getLinkedInAuthUrl();
    return sendSuccess(res, { url }, 200);
  } catch (err) {
    next(err);
  }
}

async function linkedInCallback(req, res, next) {
  try {
    const { code } = req.query;

    if (!code) {
      next({ status: 400, message: 'Authorization code missing' });
      return;
    }

    const tokenPayload = await exchangeLinkedInCodeForToken(code);
    const accessToken = tokenPayload.access_token;
    const profile = await getLinkedInProfile(accessToken);

    const first = profile.localizedFirstName ?? '';
    const last = profile.localizedLastName ?? '';
    const platformAccountName = `${first} ${last}`.trim();

    await ConnectedAccount.findOneAndUpdate(
      {
        userId: req.user.userId,
        platformAccountId: String(profile.id),
        platform: 'LINKEDIN',
      },
      {
        userId: req.user.userId,
        platform: 'LINKEDIN',
        platformAccountId: String(profile.id),
        platformAccountName,
        accessToken: encryptToken(accessToken),
        scope:
          'w_member_social,r_liteprofile,w_organization_social,r_organization_social',
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return sendSuccess(
      res,
      { message: 'LinkedIn connected successfully' },
      200,
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  facebookConnect,
  facebookCallback,
  getConnectedAccounts,
  disconnectAccount,
  linkedInConnect,
  linkedInCallback,
};
