const Redis = require('ioredis');

const { REDIS_URL } = require('./env.js');
const logger = require('../utils/logger.js');

const redis = new Redis(REDIS_URL, { family: 4 });

redis.on('error', (err) => {
  logger.error(err);
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

module.exports = redis;
