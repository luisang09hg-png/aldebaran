/**
 * profileController.js
 * Maneja req/res. Delega toda la lógica a profileService.
 * SEGURIDAD: req.userId viene del authMiddleware; nunca se acepta del body.
 */
const profileService = require('../services/profileService');

// ─── GET /api/profile/me ──────────────────────────────────────────────────────
async function getMyProfile(req, res) {
  try {
    const profile = await profileService.getOrCreateProfile(req.userId);
    res.json({ data: profile });
  } catch (err) {
    console.error('[getMyProfile]', err);
    res.status(500).json({ error: 'Error al obtener perfil.' });
  }
}

// ─── PATCH /api/profile/me ────────────────────────────────────────────────────
async function updateMyProfile(req, res) {
  try {
    const profile = await profileService.updateIdentity(req.userId, req.body);
    res.json({ data: profile });
  } catch (err) {
    console.error('[updateMyProfile]', err);
    res.status(500).json({ error: 'Error al actualizar perfil.' });
  }
}

// ─── POST /api/profile/job-email/verify ───────────────────────────────────────
async function sendJobEmailVerification(req, res) {
  try {
    const { jobEmail } = req.body;
    const token = await profileService.initiateJobEmailVerification(req.userId, jobEmail);

    // En producción: enviar email real con nodemailer.
    // Por ahora devolvemos el token en dev para facilitar pruebas.
    const isDev = process.env.NODE_ENV !== 'production';
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-job-email?token=${token}`;

    res.json({
      message: 'Correo de verificación enviado.',
      ...(isDev ? { _devToken: token, _devUrl: verifyUrl } : {}),
    });
  } catch (err) {
    console.error('[sendJobEmailVerification]', err);
    res.status(500).json({ error: 'Error al iniciar verificación.' });
  }
}

// ─── POST /api/profile/job-email/confirm ──────────────────────────────────────
async function confirmJobEmail(req, res) {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token requerido.' });
    }
    await profileService.confirmJobEmail(req.userId, token);
    res.json({ message: 'Correo de empleo verificado correctamente.' });
  } catch (err) {
    const known = ['Token inválido.', 'Token expirado.', 'No hay verificación pendiente.'];
    if (known.includes(err.message)) {
      return res.status(400).json({ error: err.message });
    }
    console.error('[confirmJobEmail]', err);
    res.status(500).json({ error: 'Error al confirmar verificación.' });
  }
}

// ─── Logros ───────────────────────────────────────────────────────────────────
async function createAchievement(req, res) {
  try {
    const ach = await profileService.createAchievement(req.userId, req.body);
    res.status(201).json({ data: ach });
  } catch (err) {
    console.error('[createAchievement]', err);
    res.status(500).json({ error: 'Error al crear logro.' });
  }
}

async function updateAchievement(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });
    const ach = await profileService.updateAchievement(req.userId, id, req.body);
    res.json({ data: ach });
  } catch (err) {
    if (err.message === 'No encontrado o sin permisos.') {
      return res.status(404).json({ error: err.message });
    }
    console.error('[updateAchievement]', err);
    res.status(500).json({ error: 'Error al actualizar logro.' });
  }
}

async function deleteAchievement(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });
    await profileService.deleteAchievement(req.userId, id);
    res.json({ message: 'Logro eliminado.' });
  } catch (err) {
    if (err.message === 'No encontrado o sin permisos.') {
      return res.status(404).json({ error: err.message });
    }
    console.error('[deleteAchievement]', err);
    res.status(500).json({ error: 'Error al eliminar logro.' });
  }
}

// ─── Formación ────────────────────────────────────────────────────────────────
async function createEducation(req, res) {
  try {
    const edu = await profileService.createEducation(req.userId, req.body);
    res.status(201).json({ data: edu });
  } catch (err) {
    console.error('[createEducation]', err);
    res.status(500).json({ error: 'Error al crear formación.' });
  }
}

async function updateEducation(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });
    const edu = await profileService.updateEducation(req.userId, id, req.body);
    res.json({ data: edu });
  } catch (err) {
    if (err.message === 'No encontrado o sin permisos.') {
      return res.status(404).json({ error: err.message });
    }
    console.error('[updateEducation]', err);
    res.status(500).json({ error: 'Error al actualizar formación.' });
  }
}

async function deleteEducation(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });
    await profileService.deleteEducation(req.userId, id);
    res.json({ message: 'Formación eliminada.' });
  } catch (err) {
    if (err.message === 'No encontrado o sin permisos.') {
      return res.status(404).json({ error: err.message });
    }
    console.error('[deleteEducation]', err);
    res.status(500).json({ error: 'Error al eliminar formación.' });
  }
}

// ─── Preferencias ─────────────────────────────────────────────────────────────
async function updatePreferences(req, res) {
  try {
    const prefs = await profileService.updatePreferences(req.userId, req.body);
    res.json({ data: prefs });
  } catch (err) {
    console.error('[updatePreferences]', err);
    res.status(500).json({ error: 'Error al guardar preferencias.' });
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  sendJobEmailVerification,
  confirmJobEmail,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  createEducation,
  updateEducation,
  deleteEducation,
  updatePreferences,
};
