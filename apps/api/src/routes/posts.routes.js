const { Router } = require('express');
const { postsController } = require('../controllers/postsController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { uploadMiddleware } = require('../services/uploadService');

const router = Router();

router.post('/', authMiddleware, uploadMiddleware, postsController.createPost);
router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.put('/:id', authMiddleware, postsController.updatePost);
router.delete('/:id', authMiddleware, postsController.deletePost);
router.post('/:id/react', authMiddleware, postsController.reactToPost);

module.exports = router;
