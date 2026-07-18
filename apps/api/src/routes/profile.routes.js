/**
 * profile.routes.js
 * Rutas del perfil de usuario.
 *
 * GET    /api/profile/me                    — obtener perfil propio
 * PATCH  /api/profile/me                    — actualizar identidad/skills
 * POST   /api/profile/job-email/verify      — iniciar verificación de correo de empleo
 * POST   /api/profile/job-email/confirm     — confirmar token de correo de empleo
 *
 * POST   /api/profile/achievements          — crear logro
 * PATCH  /api/profile/achievements/:id      — editar logro
 * DELETE /api/profile/achievements/:id      — eliminar logro
 *
 * POST   /api/profile/educations            — crear entrada de formación
 * PATCH  /api/profile/educations/:id        — editar formación
 * DELETE /api/profile/educations/:id        — eliminar formación
 *
 * PATCH  /api/profile/preferences           — guardar preferencias de UI
 */
const { Router } = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate }       = require('../middlewares/validate');
const ctrl               = require('../controllers/profileController');
const {
  identitySchema,
  jobEmailSchema,
  achievementCreateSchema,
  achievementUpdateSchema,
  educationCreateSchema,
  educationUpdateSchema,
  preferencesSchema,
} = require('../utils/profileSchemas');

const router = Router();

// Todos los endpoints requieren sesión activa
router.use(authMiddleware);

// ── Perfil ───────────────────────────────────────────────────────────────────
router.get('/me',   ctrl.getMyProfile);
router.patch('/me', validate(identitySchema), ctrl.updateMyProfile);

// ── Correo de empleo ──────────────────────────────────────────────────────────
router.post('/job-email/verify',  validate(jobEmailSchema), ctrl.sendJobEmailVerification);
router.post('/job-email/confirm', ctrl.confirmJobEmail);

// ── Logros ───────────────────────────────────────────────────────────────────
router.post(  '/achievements',     validate(achievementCreateSchema), ctrl.createAchievement);
router.patch( '/achievements/:id', validate(achievementUpdateSchema), ctrl.updateAchievement);
router.delete('/achievements/:id', ctrl.deleteAchievement);

// ── Formación ─────────────────────────────────────────────────────────────────
router.post(  '/educations',     validate(educationCreateSchema), ctrl.createEducation);
router.patch( '/educations/:id', validate(educationUpdateSchema), ctrl.updateEducation);
router.delete('/educations/:id', ctrl.deleteEducation);

// ── Preferencias UI ───────────────────────────────────────────────────────────
router.patch('/preferences', validate(preferencesSchema), ctrl.updatePreferences);

module.exports = router;
