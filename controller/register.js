const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const User = require("../models/user.model");
const { registrationValidation } = require("../services/validations");

const register = async (req, res, next) => {
  try {
    const values = await registrationValidation.validateAsync(req.body);
    const { name, age, email, password } = values;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }

    const profilePic = req.file ? req.file.path : ""; // get the uploaded file path

    const newUser = new User({
      name,
      age,
      email,
      password,
      profilePic,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: {
        name,
        age,
        email,
        profilePic,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = register;
