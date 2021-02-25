// importing dependency
const express = require("express");
const {
  login,
  register,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");

const userRoutes = express.Router();

userRoutes.route("/register").post(register);
userRoutes.route("/login").post(login);
userRoutes.route("/forgotpassword").post(forgotPassword);
userRoutes.route("/resetpassword/:token").patch(resetPassword);

module.exports = userRoutes;
