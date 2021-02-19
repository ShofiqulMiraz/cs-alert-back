// importing dependency
const express = require("express");
const {
  CreateScamRequest,
  deleteScamRequest,
  getAllScamRequests,
  getSingleScamRequest,
} = require("../controllers/scamrequests");
const { protect, restrict } = require("../controllers/user");

const scamRequestRoutes = express.Router();

scamRequestRoutes
  .route("/")
  .get(protect, restrict, getAllScamRequests)
  .post(protect, CreateScamRequest);

scamRequestRoutes
  .route("/:id")
  .get(protect, restrict, getSingleScamRequest)
  .delete(protect, restrict, deleteScamRequest);

module.exports = scamRequestRoutes;
