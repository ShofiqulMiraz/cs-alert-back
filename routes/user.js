// importing dependency
const express = require("express");
const { login, register } = require("../controllers/user");

const userRoutes = express.Router();

userRoutes.route("/register").post(register);
userRoutes.route("/login").post(login);

module.exports = userRoutes;
