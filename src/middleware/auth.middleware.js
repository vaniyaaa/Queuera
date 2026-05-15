const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/env.js');

function requireAuth(req, res, next) {
  const header = req.get('Authorization');

  if (!header || typeof header !== 'string') {
    next({ status: 401, message: 'No token provided' });
    return;
  }

  const match = header.match(/^Bearer\s+(.+)$/);
  if (!match || !match[1]) {
    next({ status: 401, message: 'No token provided' });
    return;
  }

  const token = match[1].trim();
  if (!token) {
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
