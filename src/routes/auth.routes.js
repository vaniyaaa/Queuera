const express = require('express');

const requireAuth = require('../middleware/auth.middleware.js');
const { validate } = require('../middleware/validate.middleware.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.post(
  '/register',
  validate({
    email: { required: true, type: 'email' },
    password: { required: true },
  }),
  authController.register,
);

router.post(
  '/login',
  validate({ email: { required: true }, password: { required: true } }),
  authController.login,
);

router.get(
  '/facebook/connect',
  requireAuth,
  authController.facebookConnect,
);

router.get(
  '/facebook/callback',
  requireAuth,
  authController.facebookCallback,
);

router.get(
  '/linkedin/connect',
  requireAuth,
  authController.linkedInConnect,
);

router.get(
  '/linkedin/callback',
  requireAuth,
  authController.linkedInCallback,
);

router.get('/accounts', requireAuth, authController.getConnectedAccounts);

router.delete(
  '/accounts/:id',
  requireAuth,
  authController.disconnectAccount,
);

module.exports = router;
