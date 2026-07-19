const { z } = require('zod');

const createApplicationSchema = z.object({
  jobId: z.number().int().positive()
});

const updateStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'IN_REVIEW', 'INTERVIEW', 'REJECTED', 'ACCEPTED'])
});

module.exports = {
  createApplicationSchema,
  updateStatusSchema
};
