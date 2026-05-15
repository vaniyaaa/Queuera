const express = require('express');

const authRoutes = require('./auth.routes.js');
const postRoutes = require('./post.routes.js');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

module.exports = router;
