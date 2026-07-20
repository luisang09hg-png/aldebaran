const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          success: false,
          message: 'Parámetros de consulta inválidos',
          details: error.errors
        });
      }
      next(error);
    }
  };
};

module.exports = { validateQuery };
