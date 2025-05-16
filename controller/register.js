const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { registrationValidation } = require("../services/validations");
router.post("/register", async (req, res, next) => {
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
    const newUser = new User({name,age,email,password,});

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: values,
    });
  } catch (error) {
    next(error); 
  }
});

module.exports = router;
