const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed; // Reemplazamos los query params con los valores parseados y validados
      next();
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          error: 'Query parameters validation failed',
          details: error.errors
        });
      }
      next(error);
    }
  };
};

module.exports = { validateQuery };
