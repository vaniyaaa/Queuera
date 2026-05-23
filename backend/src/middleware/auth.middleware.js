const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env.js');
const logger = require('../utils/logger.js');

function requireAuth(req, res, next) {
  const token = req.cookies?.queuera_token;

  if (!token || typeof token !== 'string' || token.trim() === '') {
    logger.warn(
      `[auth:require] missing token method=${req.method} path=${req.originalUrl} origin=${req.get('origin') ?? 'none'} cookieNames=${Object.keys(req.cookies ?? {}).join(',') || 'none'}`,
    );
    next({ status: 401, message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    logger.info(`[auth:require] success userId=${decoded.userId} method=${req.method} path=${req.originalUrl}`);
    next();
  } catch (err) {
    logger.warn(`[auth:require] invalid token method=${req.method} path=${req.originalUrl} error=${err.message}`);
    next({ status: 401, message: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
