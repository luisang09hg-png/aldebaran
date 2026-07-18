const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const crypto = require('crypto');

const authService = {
  async register({ email, password, fullName }) {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        profile: {
          create: {
            name: fullName,
            preferences: {
              create: {}
            }
          }
        }
      },
      include: {
        profile: true
      }
    });

    return user;
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const session = await prisma.session.create({
      data: {
        id: token,
        userId: user.id,
        expiresAt
      }
    });

    return { user, token };
  },

  async getUserById(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
  }
};

module.exports = { authService };
