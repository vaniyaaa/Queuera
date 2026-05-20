const ConnectedAccount = require('../models/ConnectedAccount.js');
const ScheduledPost = require('../models/ScheduledPost.js');
const { META_WEBHOOK_VERIFY_TOKEN } = require('../config/env.js');
const { addPostJob } = require('../queues/post.queue.js');
const logger = require('../utils/logger.js');
const { sendSuccess } = require('../utils/response.js');

function isMissing(value) {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  return false;
}

async function createPost(req, res, next) {
  try {
    const { connectedAccountId, content, mediaUrls, scheduledAt } = req.body;

    if (isMissing(connectedAccountId) || isMissing(content)) {
      next({
        status: 400,
        message: 'connectedAccountId and content are required',
      });
      return;
    }

    const account = await ConnectedAccount.findOne({
      _id: connectedAccountId,
      userId: req.user.userId,
    });

    if (!account) {
      next({ status: 404, message: 'Connected account not found' });
      return;
    }

    const parsedAt = new Date(scheduledAt);
    if (
      scheduledAt === undefined ||
      scheduledAt === null ||
      Number.isNaN(parsedAt.getTime())
    ) {
      next({ status: 400, message: 'Valid scheduledAt is required' });
      return;
    }

    const post = await ScheduledPost.create({
      userId: req.user.userId,
      connectedAccountId,
      content,
      mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : [],
      scheduledAt: parsedAt,
      status: 'QUEUED',
    });

    const job = await addPostJob(post._id, parsedAt);

    const updated = await ScheduledPost.findByIdAndUpdate(
      post._id,
      { jobId: String(job.id) },
      { new: true },
    );

    return sendSuccess(res, updated, 201);
  } catch (err) {
    next(err);
  }
}

async function getPosts(req, res, next) {
  try {
    const posts = await ScheduledPost.find({
      userId: req.user.userId,
    }).sort({ scheduledAt: 1 });
    return sendSuccess(res, posts, 200);
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const post = await ScheduledPost.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!post) {
      next({ status: 404, message: 'Post not found' });
      return;
    }

    return sendSuccess(res, post, 200);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const post = await ScheduledPost.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!post) {
      next({ status: 404, message: 'Post not found' });
      return;
    }

    if (post.status === 'PUBLISHED') {
      next({ status: 400, message: 'Cannot delete a published post' });
      return;
    }

    await ScheduledPost.findByIdAndDelete(post._id);

    return sendSuccess(res, { message: 'Post deleted' }, 200);
  } catch (err) {
    next(err);
  }
}

function readMetaHubQuery(req) {
  const q = req.query;
  if (q.hub && typeof q.hub === 'object') {
    return {
      mode: q.hub.mode,
      verify_token: q.hub.verify_token,
      challenge: q.hub.challenge,
    };
  }
  return {
    mode: q['hub.mode'],
    verify_token: q['hub.verify_token'],
    challenge: q['hub.challenge'],
  };
}

function metaWebhookVerify(req, res, next) {
  const { mode, verify_token: verifyToken, challenge } =
    readMetaHubQuery(req);

  if (
    mode === 'subscribe' &&
    verifyToken === META_WEBHOOK_VERIFY_TOKEN
  ) {
    return res.status(200).type('text/plain').send(String(challenge));
  }

  next({ status: 403, message: 'Webhook verification failed' });
}

function metaWebhookHandler(req, res, next) {
  try {
    const entries = Array.isArray(req.body?.entry) ? req.body.entry : [];
    for (const entry of entries) {
      const changes = Array.isArray(entry.changes) ? entry.changes : [];
      for (const change of changes) {
        if (change.field === 'feed') {
          logger.info(
            `Meta webhook feed value: ${JSON.stringify(change.value)}`,
          );
        }
      }
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    logger.error(err);
    return res.status(200).json({ received: true });
  }
}

module.exports = {
  createPost,
  getPosts,
  getPost,
  deletePost,
  metaWebhookVerify,
  metaWebhookHandler,
};
