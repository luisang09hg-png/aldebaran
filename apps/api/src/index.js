const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

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

// Require FRONTEND_URL in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.FRONTEND_URL) {
    console.error('FATAL: FRONTEND_URL must be set in production');
    process.exit(1);
  }
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos. Intenta de nuevo más tarde.' }
});

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static('uploads'));

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
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

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor.';
  res.status(status).json({ success: false, message });
});

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
