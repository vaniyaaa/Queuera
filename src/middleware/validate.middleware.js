function trimBodyStrings(body) {
  if (!body || typeof body !== 'object') {
    return;
  }
  for (const key of Object.keys(body)) {
    const value = body[key];
    if (typeof value === 'string') {
      body[key] = value.trim();
    }
  }
}

function isMissingRequired(value) {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string' && value === '') {
    return true;
  }
  return false;
}

function validate(schema) {
  return function validateMiddleware(req, res, next) {
    trimBodyStrings(req.body);

    const missing = [];
    for (const fieldName of Object.keys(schema)) {
      const rules = schema[fieldName];
      if (rules.required === true) {
        const value = req.body[fieldName];
        if (isMissingRequired(value)) {
          missing.push(fieldName);
        }
      }
    }

    if (missing.length > 0) {
      next({
        status: 400,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
      return;
    }

    for (const fieldName of Object.keys(schema)) {
      const rules = schema[fieldName];
      const value = req.body[fieldName];

      if (rules.type === 'email') {
        if (typeof value === 'string' && value.length > 0) {
          if (!value.includes('@') || !value.includes('.')) {
            next({ status: 400, message: 'Invalid email format' });
            return;
          }
        }
      }

      if (rules.type === 'url') {
        if (typeof value === 'string' && value.length > 0) {
          if (!value.startsWith('http')) {
            next({ status: 400, message: 'Invalid URL format' });
            return;
          }
        }
      }
    }

    next();
  };
}

module.exports = {
  validate,
};
