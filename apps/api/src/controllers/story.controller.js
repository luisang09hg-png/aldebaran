const storyService = require('../services/story.service');
const { processMedia } = require('../services/uploadService');

const createStory = async (req, res) => {
  try {
    let mediaUrl = req.body.mediaUrl;
    
    if (req.file) {
      mediaUrl = processMedia(req.file);
    }
    
    if (!mediaUrl) {
      return res.status(400).json({ error: 'Se requiere mediaUrl o un archivo multimedia.' });
    }

    const caption = req.body.caption;
    const story = await storyService.createStory(req.userId, mediaUrl, caption);
    
    res.status(201).json(story);
  } catch (error) {
    console.error('[StoryController] Error createStory:', error);
    res.status(500).json({ error: 'Error interno al crear story' });
  }
};

const getFeedStories = async (req, res) => {
  try {
    const stories = await storyService.getFeedStories();
    
    const grouped = {};
    stories.forEach(story => {
      const aid = story.authorId;
      if (!grouped[aid]) {
        grouped[aid] = {
          author: {
            id: story.authorId,
            name: story.author?.profile?.name || story.author?.fullName || 'Usuario',
            avatarUrl: story.author?.profile?.avatarUrl || null
          },
          stories: []
        };
      }
      grouped[aid].stories.push(story);
    });
    
    res.json({ data: Object.values(grouped) });
  } catch (error) {
    console.error('[StoryController] Error getFeedStories:', error);
    res.status(500).json({ error: 'Error interno al obtener feed de stories' });
  }
};

const deleteStory = async (req, res) => {
  try {
    const storyId = parseInt(req.params.id, 10);
    await storyService.deleteStory(storyId, req.userId);
    res.json({ message: 'Story eliminada con éxito' });
  } catch (error) {
    console.error('[StoryController] Error deleteStory:', error);
    if (error.message === 'Story no encontrada') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'No autorizado') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno al eliminar story' });
  }
};

const reactToStory = async (req, res) => {
  try {
    const storyId = parseInt(req.params.id, 10);
    const type = req.body.type || 'like';
    const result = await storyService.reactToStory(storyId, req.userId, type);
    res.json(result);
  } catch (error) {
    console.error('[StoryController] Error reactToStory:', error);
    if (error.message === 'Story no encontrada') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno al reaccionar a story' });
  }
};

module.exports = {
  createStory,
  getFeedStories,
  deleteStory,
  reactToStory
};
