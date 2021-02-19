// importing dependency
const express = require("express");
const {
  CreateVerification,
  getAllVerification,
} = require("../controllers/verification");
const { protect, restrict } = require("../controllers/user");

const VerificationRoutes = express.Router();

// one post request:public, one get request admin, one details request admin

VerificationRoutes.route("/")
  .post(CreateVerification)
  .get(protect, restrict, getAllVerification);

module.exports = VerificationRoutes;
