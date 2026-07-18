/**
 * validate.js
 * Middleware factory para validar el body con un schema de Zod.
 * Uso: router.post('/ruta', validate(myZodSchema), handler)
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ error: 'Validación fallida.', errors });
    }
    req.body = result.data; // datos limpios y tipados
    next();
  };
}

module.exports = { validate };
