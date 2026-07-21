/**
 * prisma.js — Singleton del cliente Prisma.
 * Reutiliza la instancia en desarrollo para evitar conexiones múltiples con hot-reload.
 */
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Connection pool for Vercel serverless
    maxConnections: 10,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
