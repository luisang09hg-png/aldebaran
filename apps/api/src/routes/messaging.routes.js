const { Router } = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const prisma = require('../config/prisma');

const router = Router();

router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'No se pudieron cargar las conversaciones.' });
  }
});

router.post('/conversations', authMiddleware, async (req, res) => {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        userId: req.userId,
        participantName: req.body.participantName || 'Reclutador',
        lastMessage: req.body.lastMessage || 'Hola',
      },
    });
    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'No se pudo crear la conversación.' });
  }
});

router.post('/messages', authMiddleware, async (req, res) => {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId: req.body.conversationId,
        senderId: req.userId,
        text: req.body.text,
      },
    });
    await prisma.conversation.update({
      where: { id: req.body.conversationId },
      data: { lastMessage: req.body.text, updatedAt: new Date() },
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: 'No se pudo guardar el mensaje.' });
  }
});

router.post('/interviews', authMiddleware, async (req, res) => {
  try {
    const interview = await prisma.interview.create({
      data: {
        userId: req.userId,
        jobId: req.body.jobId || null,
        participantName: req.body.participantName || 'Marcos',
        status: 'scheduled',
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : null,
      },
    });
    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, error: 'No se pudo programar la entrevista.' });
  }
});

module.exports = router;
