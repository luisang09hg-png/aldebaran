const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

module.exports = {
  registerSchema,
  loginSchema
};
