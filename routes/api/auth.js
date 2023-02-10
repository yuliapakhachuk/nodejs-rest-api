const express = require('express');

const {
    register,
    login,
    logout,
    currentUser,
    updateAvatar,
  } = require("../../controllers/authController");
  const {
    validateBody,
    joiRegisterSchema,
    auth,
    upload,
  } = require("../../middlewares/index");
  const router = express.Router();
  
  router.post("/register", validateBody(joiRegisterSchema), register);
  router.post("/login", validateBody(joiRegisterSchema), login);
  router.get("/logout", auth, logout);
  router.get("/current", auth, currentUser);
  router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
  
  module.exports = router;
  