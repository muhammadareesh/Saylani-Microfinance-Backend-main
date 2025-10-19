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
  console.log("ye req hai>>>>",req.body)
  const { name, cnic, password, email } = req.body;
  const existUser = await User.findOne({ email, password });

  try {
    if (existUser) {
      return res.status(400).json({
        message: "user already exist, please use different email or cnic",
      });
    }

    const generatedPassword = new mongoose.Types.ObjectId()
      .toString()
      .slice(18);

    const hashedpassword = await bcrypt.hash(`${generatedPassword}${cnic}`, 10);

    const user = new User({ name, cnic, email, password: hashedpassword });

    // save to mongodb
    await user.save();

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
    const emailClean = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailClean  });

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


module.exports = {
  registerController,
  LoginController,
  userController,
};
