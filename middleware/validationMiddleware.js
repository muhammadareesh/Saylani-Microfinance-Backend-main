const validationRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      return res.status(400).json({
        error: "Validation failed",
      });
    }
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    next();
  };
};

module.exports = validationRequest;
