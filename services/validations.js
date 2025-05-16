const Joi = require("joi");
const registrationValidation = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().required(),
    age: Joi.number(),
    password: Joi.string().required(),
   
});
const loginValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  });
module.exports={registrationValidation,loginValidation}