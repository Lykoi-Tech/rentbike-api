const joi = require('joi');

const registerValidate = joi.object({
  username: joi.string().required().min(4).max(30),
  email: joi.string().required().max(30),
  password: joi.string().required().min(5)
});

const getAllValidate = joi.object({
  page: joi.number().optional(),
  size: joi.number().optional()
});

module.exports = {
  registerValidate,
  getAllValidate
};
