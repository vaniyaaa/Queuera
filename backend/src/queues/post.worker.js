const { Worker } = require('bullmq');

const { REDIS_URL } = require('../config/env.js');
const ScheduledPost = require('../models/ScheduledPost.js');
const logger = require('../utils/logger.js');
const { decryptToken } = require('../services/token.service.js');
const {
  publishToFacebook,
  publishToInstagram,
} = require('../services/meta.service.js');
const { publishToLinkedIn } = require('../services/linkedin.service.js');

const worker = new Worker(
  'post-queue',
  async (job) => {
    const postId = job.data.postId;

    const post = await ScheduledPost.findById(postId).populate(
      'connectedAccountId',
    );

    if (!post) {
      throw new Error(`Post not found: ${postId}`);
    }

    if (post.status !== 'QUEUED') {
      logger.info(
        `Skipping publish for post ${postId}: status is ${post.status}`,
      );
      return;
    }

    const accessToken = decryptToken(post.connectedAccountId.accessToken);
    const platform = post.connectedAccountId.platform;

    if (platform === 'FACEBOOK') {
      await publishToFacebook(
        accessToken,
        post.connectedAccountId.platformAccountId,
        post.content,
        post.mediaUrls,
      );
    } else if (platform === 'INSTAGRAM') {
      await publishToInstagram(
        accessToken,
        post.connectedAccountId.platformAccountId,
        post.content,
        post.mediaUrls,
      );
    } else if (platform === 'LINKEDIN') {
      const authorUrn = `urn:li:person:${post.connectedAccountId.platformAccountId}`;
      await publishToLinkedIn(accessToken, authorUrn, post.content);
    } else {
      logger.info(
        `Skipping publish for post ${postId}: unsupported platform ${platform}`,
      );
      return;
    }

    await ScheduledPost.findByIdAndUpdate(post._id, {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });

    logger.info(`Post published: ${postId}`);
  },
  { connection: { url: REDIS_URL, family: 4 } },
);

worker.on('failed', (job, err) => {
  const postId = job?.data?.postId;
  const reason = job?.failedReason || err?.message || 'Unknown error';

  if (postId) {
    ScheduledPost.findByIdAndUpdate(postId, {
      status: 'FAILED',
      failureReason: reason,
    })
      .catch((updateErr) => {
        logger.error(updateErr);
      });
  }

  logger.error(`Post job failed: ${postId || 'unknown'} — ${reason}`);
});

module.exports = worker;
