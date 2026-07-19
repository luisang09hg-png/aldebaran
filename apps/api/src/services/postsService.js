const prisma = require('../config/prisma');

const postsService = {
  async createPost({ authorId, content, mediaUrl, achievementId }) {
    return prisma.post.create({
      data: {
        authorId,
        content,
        mediaUrl,
        achievementId: achievementId ? parseInt(achievementId, 10) : null
      },
      include: {
        author: {
          select: { id: true, fullName: true, profile: true }
        }
      }
    });
  },

  async getPosts({ skip = 0, take = 20 }) {
    const posts = await prisma.post.findMany({
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

    // Cargar logros asociados en memoria dado que no hay una relación directa en Prisma
    const achievementIds = posts
      .map(p => p.achievementId)
      .filter(id => id !== null && id !== undefined);

    if (achievementIds.length > 0) {
      const achievements = await prisma.achievement.findMany({
        where: { id: { in: achievementIds } }
      });
      const achievementMap = new Map(achievements.map(a => [a.id, a]));
      posts.forEach(post => {
        if (post.achievementId) {
          post.achievement = achievementMap.get(post.achievementId) || null;
        }
      });
    }

    return posts;
  },

  async getPostById(postId) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, fullName: true, profile: true }
        },
        reactions: true
      }
    });

    if (post && post.achievementId) {
      post.achievement = await prisma.achievement.findUnique({
        where: { id: post.achievementId }
      });
    }

    return post;
  },

  async updatePost(postId, authorId, { content, achievementId }) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    
    if (!post) throw new Error('Post no encontrado');
    if (post.authorId !== authorId) throw new Error('No autorizado para editar este post');

    const updated = await prisma.post.update({
      where: { id: postId },
      data: { 
        content,
        achievementId: achievementId ? parseInt(achievementId, 10) : null
      },
      include: {
        author: {
          select: { id: true, fullName: true, profile: true }
        },
        reactions: true
      }
    });

    if (updated.achievementId) {
      updated.achievement = await prisma.achievement.findUnique({
        where: { id: updated.achievementId }
      });
    }

    return updated;
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

