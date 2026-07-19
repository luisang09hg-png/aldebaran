const { z } = require('zod');

const createStorySchema = z.object({
  mediaUrl: z.string().url().optional(),
  caption: z.string().max(200, 'Caption no puede exceder 200 caracteres').optional(),
});

module.exports = {
  createStorySchema
};
