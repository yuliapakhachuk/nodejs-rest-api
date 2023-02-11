const { User } = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { v4 } = require("uuid");
const sendGrid = require("@sendgrid/mail");

const { Conflict, Unauthorized, BadRequest } = require("http-errors");
const bcrypt = require("bcrypt");

const { JWT_SECRET, SENDGRID_API_KEY } = process.env;

const register = async (req, res, next) => {

  const { email, password } = req.body;
  const verificationToken = v4();
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    sendGrid.setApiKey(SENDGRID_API_KEY);
    const findUser = await User.findOne({ email });
    if (findUser) {
      throw new Conflict("Email in use");
    }
    const user = await User.create({
      email,
      password: hashedPassword,
      verificationToken,
      avatarURL: gravatar.url(email),
      verify: false,
    });

    const sendMail = {
      from: "testyuliat@gmail.com",
      to: email,
      subject: "Please confirm your email address",
      text: "Confirm your email addres",
      html: `<strong>Confirm your account by following this link
                <a href = "http://localhost:3000/api/users/verify/${verificationToken}">Please click on this link to confirm your email</a>
              </strong>`,
    };

    const response = await sendGrid.send(sendMail);
    console.log(response);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: gravatar.url(user.email),
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

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tmpPath, filename } = req.file;

  try {
    const newPath = path.resolve(
      __dirname,
      "../",
      "public",
      "avatars",
      filename
    );
    await fs.rename(tmpPath, newPath);
    const avatarURL = path.join("avatars", filename);
    Jimp.read(newPath)
      .then((avatar) => {
        return avatar.resize(250, 250).write(newPath); // resize
      })
      .catch((err) => {
        console.error(err);
      });
    await User.findByIdAndUpdate(_id, { avatarURL: avatarURL });
    return res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  console.log(verificationToken);
  const user = await User.findOne({
    verificationToken: verificationToken,
  });

  if (!user) {
    throw BadRequest("Verify token is not valid!");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      email,
    });
    sendGrid.setApiKey(SENDGRID_API_KEY);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Please indicate correct email address" });
    } else if (user.verify === true) {
      throw BadRequest("Verification has already been passed");
    }
    const sendMail = {
      from: "rihter.yan@gmail.com",
      to: email,
      subject: "Please confirm your email address",
      text: "Confirm your email address12312412",
      html: `<strong>
              Confirm your account by following this link
              <a href = "http://localhost:3000/api/users/verify/${user.verificationToken}">
                Please click on this link to confirm your email
              </a>
              </strong>`,
    };

    const response = await sendGrid.send(sendMail);
    console.log(response);
    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
};
