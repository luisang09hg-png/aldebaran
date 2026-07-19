const prisma = require('../config/prisma');

const createStory = async (authorId, mediaUrl, caption) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return await prisma.story.create({
    data: {
      authorId,
      mediaUrl,
      caption: caption || null,
      expiresAt,
    },
    include: {
      author: {
        include: {
          profile: true
        }
      }
    }
  });
};

const getFeedStories = async () => {
  return await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: {
        include: {
          profile: true
        }
      }
    }
  });
};

const getUserStories = async (userId) => {
  return await prisma.story.findMany({
    where: {
      authorId: userId,
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const deleteExpiredStories = async () => {
  const result = await prisma.story.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  });
  return result; // contains count
};

const deleteStory = async (storyId, userId) => {
  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story) {
    throw new Error('Story no encontrada');
  }
  if (story.authorId !== userId) {
    throw new Error('No autorizado');
  }
  
  return await prisma.story.delete({
    where: { id: storyId }
  });
};

const reactToStory = async (storyId, userId, type) => {
  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story) {
    throw new Error('Story no encontrada');
  }

  const existingReaction = await prisma.reaction.findFirst({
    where: {
      storyId,
      userId,
      type
    }
  });

  if (existingReaction) {
    await prisma.reaction.delete({
      where: { id: existingReaction.id }
    });
    return { added: false };
  } else {
    await prisma.reaction.create({
      data: {
        storyId,
        userId,
        type
      }
    });
    return { added: true };
  }
};

module.exports = {
  createStory,
  getFeedStories,
  getUserStories,
  deleteExpiredStories,
  deleteStory,
  reactToStory
};
