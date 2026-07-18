const prisma = require('../config/prisma');

const postsService = {
  async createPost({ authorId, content, mediaUrl }) {
    return prisma.post.create({
      data: {
        authorId,
        content,
        mediaUrl
      },
      include: {
        author: {
          select: { id: true, fullName: true, profile: true }
        }
      }
    });
  },

  async getPosts({ skip = 0, take = 20 }) {
    return prisma.post.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, fullName: true, profile: true }
        },
        reactions: true
      }
    });
  },

  async getPostById(postId) {
    return prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, fullName: true, profile: true }
        },
        reactions: true
      }
    });
  },

  async updatePost(postId, authorId, { content }) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    
    if (!post) throw new Error('Post no encontrado');
    if (post.authorId !== authorId) throw new Error('No autorizado para editar este post');

    return prisma.post.update({
      where: { id: postId },
      data: { content },
      include: {
        author: {
          select: { id: true, fullName: true, profile: true }
        },
        reactions: true
      }
    });
  },

  async deletePost(postId, authorId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    
    if (!post) throw new Error('Post no encontrado');
    if (post.authorId !== authorId) throw new Error('No autorizado para eliminar este post');

    return prisma.post.delete({
      where: { id: postId }
    });
  },

  async reactToPost(postId, userId, { type }) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post no encontrado');

    // Check if reaction exists
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        postId,
        userId,
        type
      }
    });

    if (existingReaction) {
      // Remove reaction if it exists (toggle)
      await prisma.reaction.delete({ where: { id: existingReaction.id } });
      return { status: 'removed' };
    } else {
      // Create reaction
      await prisma.reaction.create({
        data: {
          postId,
          userId,
          type
        }
      });
      return { status: 'added' };
    }
  }
};

module.exports = { postsService };
