const { z } = require('zod');

const createJobSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  location: z.string().optional(),
  salary: z.string().optional(),
  requirements: z.string().optional()
});

const updateJobSchema = createJobSchema.partial();

const jobQuerySchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  page: z.preprocess((val) => (val ? parseInt(val, 10) : 1), z.number().int().min(1)).optional().default(1),
  limit: z.preprocess((val) => (val ? parseInt(val, 10) : 10), z.number().int().min(1).max(50)).optional().default(10)
});

module.exports = {
  createJobSchema,
  updateJobSchema,
  jobQuerySchema
};
