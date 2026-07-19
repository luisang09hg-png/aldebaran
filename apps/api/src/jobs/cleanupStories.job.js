const cron = require('node-cron');
const storyService = require('../services/story.service');

function startStoryCleanupJob() {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      const { count } = await storyService.deleteExpiredStories();
      if (count > 0) {
        console.log(`[StoryCleanup] Eliminadas ${count} stories expiradas.`);
      }
    } catch (err) {
      console.error('[StoryCleanup] Error al limpiar stories:', err);
    }
  });
  console.log('[StoryCleanup] Job programado: limpieza cada hora.');
}

module.exports = { startStoryCleanupJob };
