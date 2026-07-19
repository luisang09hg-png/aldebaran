const express = require('express');
const cors    = require('cors');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const postsRoutes = require('./routes/posts.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const courseRoutes = require('./routes/course.routes');
const storyRoutes = require('./routes/story.routes');
const messagingRoutes = require('./routes/messaging.routes');
const { startStoryCleanupJob } = require('./jobs/cleanupStories.job');

const app = express();
const requestedPort = Number(process.env.PORT) || 3000;

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static('uploads'));

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messaging', messagingRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

// ── Arrancador con retry de puerto ────────────────────────────────────────────
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  }).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }
    console.error(error);
    process.exit(1);
  });
};

startStoryCleanupJob();
startServer(requestedPort);
