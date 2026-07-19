const { z } = require('zod');

const conversationSchema = z.object({
  participantName: z.string().min(1).optional(),
  lastMessage: z.string().optional(),
});

const messageSchema = z.object({
  conversationId: z.number().int().positive(),
  text: z.string().min(1),
});

const interviewSchema = z.object({
  jobId: z.number().int().positive().nullable().optional(),
  participantName: z.string().min(1).optional(),
  scheduledAt: z.string().optional(),
});

module.exports = { conversationSchema, messageSchema, interviewSchema };
