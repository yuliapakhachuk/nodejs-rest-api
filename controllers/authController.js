const { User } = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");
const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcrypt");

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  console.log("secret", JWT_SECRET);

  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      throw new Conflict("Email in use");
    }
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    });

    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!isPasswordValid || !user) {
      throw new Unauthorized("Email or password is wrong");
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  return res.status(204).json({message: `user ${id} finished session`}).end();
};

const currentUser = async (req, res) => {
  const { user } = req;
  const { email, subscription } = user;
  return res.status(200).json({ email, subscription });
};
module.exports = {
  register,
  login,
  logout,
  currentUser,
};
