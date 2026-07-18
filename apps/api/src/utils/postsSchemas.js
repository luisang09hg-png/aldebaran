const { z } = require('zod');

const createPostSchema = z.object({
  content: z.string().min(1, "El contenido no puede estar vacío").max(2000, "El contenido es demasiado largo")
});

const updatePostSchema = z.object({
  content: z.string().min(1, "El contenido no puede estar vacío").max(2000, "El contenido es demasiado largo")
});

const reactionSchema = z.object({
  type: z.string().min(1) // e.g., "like", "clap"
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  reactionSchema
};
