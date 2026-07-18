const { authService } = require('../services/authService');
const { registerSchema, loginSchema } = require('../utils/authSchemas');

const authController = {
  async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.register(validatedData);
      
      const { passwordHash, ...userWithoutPassword } = user;
      res.status(201).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      if (error.message === 'El usuario ya existe') {
        return res.status(409).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { user, token } = await authService.login(validatedData);

      const { passwordHash, ...userWithoutPassword } = user;
      res.status(200).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      if (error.message === 'Credenciales inválidas') {
        return res.status(401).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      if (!req.userId) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
      }
      const user = await authService.getUserById(req.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      
      const { passwordHash, ...userWithoutPassword } = user;
      res.status(200).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { authController };
