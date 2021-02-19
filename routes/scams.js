// importing dependency
const express = require("express");
const {
  CreateScam,
  getAllScam,
  getSingleScam,
  deleteScam,
  likeScamPost,
  unLikeScamPost,
  getSearchedItems,
} = require("../controllers/scams");
const { protect, restrict } = require("../controllers/user");

const scamRoutes = express.Router();

scamRoutes.route("/").post(protect, restrict, CreateScam).get(getAllScam);
scamRoutes.route("/search/:term").get(getSearchedItems);
scamRoutes.route("/:slug").get(getSingleScam);
scamRoutes.route("/:id").delete(protect, restrict, deleteScam);
scamRoutes.route("/:id/like").patch(protect, likeScamPost);
scamRoutes.route("/:id/unlike").patch(protect, unLikeScamPost);

module.exports = scamRoutes;
