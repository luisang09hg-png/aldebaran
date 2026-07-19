const { postsService } = require('../services/postsService');
const { createPostSchema, updatePostSchema, reactionSchema } = require('../utils/postsSchemas');
const { processMedia } = require('../services/uploadService');

const postsController = {
  async createPost(req, res, next) {
    try {
      const authorId = req.userId;
      const validatedData = createPostSchema.parse(req.body);
      
      const mediaUrl = await processMedia(req.file);

      const post = await postsService.createPost({
        authorId,
        content: validatedData.content,
        mediaUrl,
        achievementId: validatedData.achievementId
      });

      res.status(201).json({ success: true, data: post });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      next(error);
    }
  },

  async getPosts(req, res, next) {
    try {
      const skip = parseInt(req.query.skip) || 0;
      const take = parseInt(req.query.take) || 20;

      const posts = await postsService.getPosts({ skip, take });
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      next(error);
    }
  },

  async getPostById(req, res, next) {
    try {
      const postId = parseInt(req.params.id);
      const post = await postsService.getPostById(postId);

      if (!post) {
        return res.status(404).json({ success: false, message: 'Post no encontrado' });
      }

      res.status(200).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  },

  async updatePost(req, res, next) {
    try {
      const authorId = req.userId;
      const postId = parseInt(req.params.id);
      const validatedData = updatePostSchema.parse(req.body);

      const post = await postsService.updatePost(postId, authorId, validatedData);
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      if (error.message === 'Post no encontrado') {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error.message === 'No autorizado para editar este post') {
        return res.status(403).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  async deletePost(req, res, next) {
    try {
      const authorId = req.userId;
      const postId = parseInt(req.params.id);

      await postsService.deletePost(postId, authorId);
      res.status(200).json({ success: true, message: 'Post eliminado' });
    } catch (error) {
      if (error.message === 'Post no encontrado') {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error.message === 'No autorizado para eliminar este post') {
        return res.status(403).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  async reactToPost(req, res, next) {
    try {
      const userId = req.userId;
      const postId = parseInt(req.params.id);
      const validatedData = reactionSchema.parse(req.body);

      const result = await postsService.reactToPost(postId, userId, validatedData);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      if (error.message === 'Post no encontrado') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }
};

module.exports = { postsController };
