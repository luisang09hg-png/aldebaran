/**
 * profileSchemas.js
 * Schemas Zod para validar los endpoints de perfil.
 */
const { z } = require('zod');

// ─── Identidad ────────────────────────────────────────────────────────────────
const identitySchema = z.object({
  name:         z.string().min(1).max(100).optional(),
  bio:          z.string().max(500).optional(),
  contactEmail: z.string().email().max(255).optional().nullable(),
  avatarUrl:    z.string().url().max(2048).optional().nullable(),
  skills:       z.array(z.string().max(50)).max(30).optional(),
});

// ─── Correo de empleo ─────────────────────────────────────────────────────────
const jobEmailSchema = z.object({
  jobEmail: z.string().email().max(255),
});

// ─── Logros ───────────────────────────────────────────────────────────────────
const achievementCreateSchema = z.object({
  title:       z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  fileUrl:     z.string().url().max(2048).optional().nullable(),
});

const achievementUpdateSchema = achievementCreateSchema.partial();

// ─── Formación ────────────────────────────────────────────────────────────────
const educationCreateSchema = z.object({
  institution: z.string().min(1).max(200),
  degree:      z.string().min(1).max(200),
  startDate:   z.string().datetime(),
  endDate:     z.string().datetime().optional().nullable(),
  eduStatus:   z.enum(['EN_CURSO', 'EGRESADO', 'TITULADO']).default('EN_CURSO'),
});

const educationUpdateSchema = educationCreateSchema.partial();

// ─── Preferencias ─────────────────────────────────────────────────────────────
const preferencesSchema = z.object({
  theme:       z.enum(['light', 'dark']).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  layoutOrder: z.array(z.string()).max(10).optional(),
});

module.exports = {
  identitySchema,
  jobEmailSchema,
  achievementCreateSchema,
  achievementUpdateSchema,
  educationCreateSchema,
  educationUpdateSchema,
  preferencesSchema,
};
