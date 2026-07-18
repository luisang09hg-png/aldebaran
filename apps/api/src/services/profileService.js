/**
 * profileService.js
 * Lógica de negocio para el perfil de usuario.
 * Los controladores delegan aquí; este módulo habla con Prisma.
 */
const crypto = require('crypto');
const prisma = require('../config/prisma');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function serializeSkills(skills) {
  return JSON.stringify(skills ?? []);
}
function parseSkills(raw) {
  try { return JSON.parse(raw); } catch { return []; }
}
function parseLayoutOrder(raw) {
  try { return JSON.parse(raw); } catch { return []; }
}
function formatProfile(profile) {
  if (!profile) return null;
  return {
    ...profile,
    skills: parseSkills(profile.skills),
    preferences: profile.preferences
      ? {
          ...profile.preferences,
          layoutOrder: parseLayoutOrder(profile.preferences.layoutOrder),
        }
      : null,
  };
}

// ─── Obtener o crear perfil ───────────────────────────────────────────────────
async function getOrCreateProfile(userId) {
  let profile = await prisma.userProfile.findUnique({
    where: { userId },
    include: { achievements: true, educations: true, preferences: true },
  });
  if (!profile) {
    profile = await prisma.userProfile.create({
      data: { userId },
      include: { achievements: true, educations: true, preferences: true },
    });
  }
  return formatProfile(profile);
}

// ─── Actualizar identidad ─────────────────────────────────────────────────────
async function updateIdentity(userId, data) {
  const updateData = { ...data };
  if (data.skills !== undefined) {
    updateData.skills = serializeSkills(data.skills);
  }
  const profile = await prisma.userProfile.update({
    where: { userId },
    data: updateData,
    include: { achievements: true, educations: true, preferences: true },
  });
  return formatProfile(profile);
}

// ─── Correo de empleo ─────────────────────────────────────────────────────────
async function initiateJobEmailVerification(userId, jobEmail) {
  const token = crypto.randomBytes(32).toString('hex');
  const exp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.userProfile.upsert({
    where: { userId },
    create: { userId, jobEmail, jobEmailToken: token, jobEmailTokenExp: exp, jobEmailVerified: false },
    update: { jobEmail, jobEmailToken: token, jobEmailTokenExp: exp, jobEmailVerified: false },
  });

  return token; // el llamador lo envía por email
}

async function confirmJobEmail(userId, token) {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile || !profile.jobEmailToken) {
    throw new Error('No hay verificación pendiente.');
  }
  if (profile.jobEmailToken !== token) {
    throw new Error('Token inválido.');
  }
  if (profile.jobEmailTokenExp < new Date()) {
    throw new Error('Token expirado.');
  }
  await prisma.userProfile.update({
    where: { userId },
    data: { jobEmailVerified: true, jobEmailToken: null, jobEmailTokenExp: null },
  });
  return true;
}

// ─── Logros ───────────────────────────────────────────────────────────────────
async function createAchievement(userId, data) {
  const profile = await getOrCreateProfile(userId);
  return prisma.achievement.create({
    data: { ...data, profileId: profile.id },
  });
}

async function updateAchievement(userId, achievementId, data) {
  // Verificar que el logro pertenece al usuario
  const ach = await prisma.achievement.findFirst({
    where: { id: achievementId, profile: { userId } },
  });
  if (!ach) throw new Error('No encontrado o sin permisos.');

  return prisma.achievement.update({
    where: { id: achievementId },
    data,
  });
}

async function deleteAchievement(userId, achievementId) {
  const ach = await prisma.achievement.findFirst({
    where: { id: achievementId, profile: { userId } },
  });
  if (!ach) throw new Error('No encontrado o sin permisos.');
  await prisma.achievement.delete({ where: { id: achievementId } });
}

// ─── Formación ────────────────────────────────────────────────────────────────
async function createEducation(userId, data) {
  const profile = await getOrCreateProfile(userId);
  return prisma.education.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      profileId: profile.id,
    },
  });
}

async function updateEducation(userId, educationId, data) {
  const edu = await prisma.education.findFirst({
    where: { id: educationId, profile: { userId } },
  });
  if (!edu) throw new Error('No encontrado o sin permisos.');

  const updateData = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

  return prisma.education.update({ where: { id: educationId }, data: updateData });
}

async function deleteEducation(userId, educationId) {
  const edu = await prisma.education.findFirst({
    where: { id: educationId, profile: { userId } },
  });
  if (!edu) throw new Error('No encontrado o sin permisos.');
  await prisma.education.delete({ where: { id: educationId } });
}

// ─── Preferencias ─────────────────────────────────────────────────────────────
async function updatePreferences(userId, data) {
  const profile = await getOrCreateProfile(userId);
  const updateData = { ...data };
  if (data.layoutOrder) updateData.layoutOrder = JSON.stringify(data.layoutOrder);

  return prisma.userPreferences.upsert({
    where: { profileId: profile.id },
    create: { profileId: profile.id, ...updateData },
    update: updateData,
  });
}

module.exports = {
  getOrCreateProfile,
  updateIdentity,
  initiateJobEmailVerification,
  confirmJobEmail,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  createEducation,
  updateEducation,
  deleteEducation,
  updatePreferences,
};
