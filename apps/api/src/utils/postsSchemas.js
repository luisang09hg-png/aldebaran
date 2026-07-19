const { z } = require('zod');

const createPostSchema = z.object({
  content: z.string().min(1, "El contenido no puede estar vacío").max(2000, "El contenido es demasiado largo"),
  achievementId: z.preprocess((val) => (val ? parseInt(val, 10) : undefined), z.number().int().positive()).optional()
});

const updatePostSchema = z.object({
  content: z.string().min(1, "El contenido no puede estar vacío").max(2000, "El contenido es demasiado largo"),
  achievementId: z.preprocess((val) => (val ? parseInt(val, 10) : undefined), z.number().int().positive()).optional()
});

const reactionSchema = z.object({
  type: z.string().min(1) // e.g., "like", "clap"
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  reactionSchema
};

