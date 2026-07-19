const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { uploadMiddleware } = require('../services/uploadService');
const storyController = require('../controllers/story.controller');
const { createStorySchema } = require('../models/storySchemas');

router.get('/feed', storyController.getFeedStories);

router.post('/', authMiddleware, uploadMiddleware.single('media'), validate(createStorySchema), storyController.createStory);

router.delete('/:id', authMiddleware, storyController.deleteStory);

router.post('/:id/react', authMiddleware, storyController.reactToStory);

module.exports = router;
