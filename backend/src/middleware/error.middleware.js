const logger = require('../utils/logger.js');
const { sendError } = require('../utils/response.js');

function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'A record with this value already exists',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    logger.error(err.message || 'JsonWebTokenError');
    if (err.stack) {
      logger.error(err.stack);
    }
    return sendError(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    logger.error(err.message || 'TokenExpiredError');
    if (err.stack) {
      logger.error(err.stack);
    }
    return sendError(res, 'Token expired', 401);
  }

  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
