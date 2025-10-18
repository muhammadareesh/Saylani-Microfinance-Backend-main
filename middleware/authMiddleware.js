const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) return res.status(400).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.id;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
