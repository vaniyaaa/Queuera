const { Queue } = require('bullmq');

const redis = require('../config/redis.js');

const postQueue = new Queue('post-queue', { connection: redis });

async function addPostJob(postId, scheduledAt) {
  const targetMs = new Date(scheduledAt).getTime();
  let delay = targetMs - Date.now();
  if (delay < 0) {
    delay = 0;
  }
  return postQueue.add(
    'publish-post',
    { postId },
    {
      delay,
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  );
}

module.exports = {
  addPostJob,
};
