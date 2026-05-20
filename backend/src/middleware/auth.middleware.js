const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env.js');

function requireAuth(req, res, next) {
  const token = req.cookies?.queuera_token;

  if (!token || typeof token !== 'string' || token.trim() === '') {
    next({ status: 401, message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next({ status: 401, message: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
