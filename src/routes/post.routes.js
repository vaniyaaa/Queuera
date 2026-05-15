const express = require('express');

const postController = require('../controllers/post.controller.js');
const requireAuth = require('../middleware/auth.middleware.js');

const router = express.Router();

router.get('/webhook/meta', postController.metaWebhookVerify);
router.post('/webhook/meta', postController.metaWebhookHandler);

router.use(requireAuth);

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.delete('/:id', postController.deletePost);

module.exports = router;
