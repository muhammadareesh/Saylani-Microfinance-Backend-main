const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");

// Models
const User = require("../models/User");

// Generate token
const generateToken = require("../utils/token");

// Register
const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const existUser = await User.findOne({ $or: [{ email }] });

  try {
    if (existUser) {
      return res.status(400).json({
        message: "user already exist, please use different email",
      });
    }

    const hashedpassword = await bcrypt.hash(`${password}`, 10);

    const user = new User({ name, email, password: hashedpassword });

    // save to mongodb
    await user.save();
    
    return res.json({
      name,
      email,
      password,
      data: "complete",
    });


    // send email
    return res.status(200).json({
      message: "User Registered, Please check your email to get password",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      newError: "Register route is not working",
    });
  }
};

// Login
const LoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        message: "invalid Credentials",
      });

    const token = generateToken(user._id);

    return res.json({ message: "Login Successfully", token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// user
const userController = (req, res) => {
  try {
    const user = User.find({ _id: user.id });
    if (!user) return res.status(400).json({ message: "invalid Credentials" });

    res.send({ message: "Login Successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Loans
const loanController = (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/loans.json");
    const data = fs.readFileSync(filePath, "utf8");
    const loans = JSON.parse(data);

    return res.status(200).json(loans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerController,
  LoginController,
  userController,
  loanController,
};
