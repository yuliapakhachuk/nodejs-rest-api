const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { Unauthorized, BadRequest } = require("http-errors");
const { User } = require("../models/user.js");
const { JWT_SECRET } = process.env;

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(BadRequest(`${error.message}`));
    }

    next();
  };
};

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string(),
  phone: Joi.string(),
});

const joiRegisterSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  try {
    if (type !== "Bearer") {
      throw new Unauthorized("Not authorized");
    }
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    req.user = user;
    next();
  } catch (error) {
    if (!error.status) {
      console.log(error);
      error.status = 401;
      error.message = "Not authorized";
    }
    next(error);
  }
};
module.exports = {
  validateBody,
  addContactSchema,
  updateStatusSchema,
  auth,
  joiRegisterSchema,
};
