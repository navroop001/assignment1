const User = require("../models/user.model");
const { loginValidation } = require("../services/validations");
const jwt = require("jsonwebtoken");
const login = async (req, res, next) => {
  try {
    const loginValues = await loginValidation.validateAsync(req.body);
    const { email, password } = loginValues;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    
    
    const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY);
    res.status(200).json({
      success: true,
      message: "User login successful",user,
      jwtToken
     
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;





