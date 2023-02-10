const Joi = require("joi");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { Unauthorized, BadRequest } = require("http-errors");
const { User } = require("../models/user.js");
const { JWT_SECRET } = process.env;

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(BadRequest(`${error.message}`));
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
      error.status = 401;
      error.message = "Not authorized";
    }
    next(error);
  }
};

const multerConfig = multer.diskStorage({
  function(req, file, cb) {
    cb(null, path.resolve(__dirname, "tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, Math.random() + file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});


module.exports = {
  validateBody,
  addContactSchema,
  updateStatusSchema,
  auth,
  joiRegisterSchema,
  upload,
};
