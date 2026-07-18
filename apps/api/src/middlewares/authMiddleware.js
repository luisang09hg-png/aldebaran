/**
 * authMiddleware.js
 * Verifica el JWT de sesión y adjunta req.userId.
 * Todos los endpoints protegidos deben usar este middleware.
 */
const crypto = require('crypto');
const prisma = require('../config/prisma');

/**
 * Middleware de autenticación simple basado en sesión.
 * El cliente envía el session token como Bearer en Authorization.
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado: token faltante.' });
  }

  const token = authHeader.slice(7);

  try {
    const session = await prisma.session.findUnique({
      where: { id: token },
      include: { user: { select: { id: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Sesión inválida o expirada.' });
    }

    req.userId = session.user.id;
    next();
  } catch (err) {
    console.error('[authMiddleware]', err);
    return res.status(500).json({ error: 'Error interno de autenticación.' });
  }
}

module.exports = { authMiddleware };
