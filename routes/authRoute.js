const express = require("express");
const router = express.Router();

// Controllers
const {
  registerController,
  LoginController,
  userController,
  loanController,
} = require("../controllers/authController");

// Middlewares
const validationRequest = require("../middleware/validationMiddleware");
const { userSchema, loginSchema } = require("../validation/userValidation");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", validationRequest(userSchema), registerController);
router.post("/login", validationRequest(loginSchema), LoginController);
router.get("/user", authMiddleware, userController);

router.get("/loans", loanController);

// Testing
router.get("/testing", (req, res) => {
  res.json({
    mongoDB: process.env.MONGO_URI,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  });
});

module.exports = router;
