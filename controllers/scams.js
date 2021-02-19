const Scam = require("../models/scams.js");
const APIFeature = require("../utils/apifeature");
const Joi = require("joi");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();

// create scam request validation
const CreateScamValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  link: Joi.string().required(),
  author: Joi.string().required(),
});

// create new scam request
// access private,only an admin can create a scam post
const CreateScam = async (req, res) => {
  // validation before Post save
  const { error } = CreateScamValidation.validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  //   get description from req.body and markdowned it
  const requestDescription = req.body.description;
  const markdownedDescription = md.render(`${requestDescription}`);

  //   create new scam request from req.body and req.user
  const newscam = new Scam({
    title: req.body.title,
    description: markdownedDescription,
    type: req.body.type,
    link: req.body.link,
    author: req.body.author,
  });

  try {
    await newscam.save();
    res.status(201).send(newscam);
  } catch (error) {
    res.status(400).send("Something went wrong, try again!");
  }
};

// get all scam
// access public
const getAllScam = async (req, res) => {
  const features = new APIFeature(Scam.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  try {
    const Scam = await features.query;
    res.send(Scam);
  } catch (error) {
    res.status(404).send("something went wrong, try again");
  }
};

// get single scam from slug
// access public
const getSingleScam = async (req, res) => {
  try {
    const singleScam = await Scam.find({ slug: req.params.slug });
    if (!singleScam) {
      return res.status(400).send("Scam not found!");
    }
    res.send(singleScam);
  } catch (error) {
    res.status(404).send("Scam not found!");
  }
};

// delete scam endpoint
// access admin,only an admin can delete a scam
const deleteScam = async (req, res) => {
  try {
    const ToDeleteScam = await Scam.findByIdAndDelete(req.params.id);
    if (!ToDeleteScam) {
      return res.status(404).send("Scam not found!");
    }
    res.send("Scam Successfully Deleted");
  } catch (error) {
    res.status(404).send("Scam not found!");
  }
};

// scam post like endpoint
// access private,only logged in user can like a scam
const likeScamPost = async (req, res) => {
  try {
    const scampost = await Scam.findById(req.params.id);
    // check if the post already liked by user
    if (
      scampost.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).send("You already voted this report!");
    }
    scampost.likes.unshift({ user: req.user.id });
    await scampost.save();
    res.send(scampost.likes);
  } catch (error) {
    res.status(404).send("something went wrong, try again");
  }
};

// scam post unlike endpoint
// access private,only logged in user can unlike a scam that he liked
const unLikeScamPost = async (req, res) => {
  try {
    const scampost = await Scam.findById(req.params.id);
    // check if the post already liked by user
    if (
      scampost.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).send("Report has not yet been voted by you.");
    }

    // get remove index
    const removeIndex = scampost.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    scampost.likes.splice(removeIndex, 1);

    await scampost.save();

    res.send(scampost.likes);
  } catch (error) {
    res.status(404).send("something went wrong, try again");
  }
};

//  showing searched items
// access public
const getSearchedItems = async (req, res) => {
  try {
    const regex = new RegExp(req.params.term, "i");
    const scams = await Scam.find({
      $or: [{ title: regex }, { author: regex }, { link: regex }],
    }).limit(10);
    res.send(scams);
  } catch (error) {
    res.status(404).send("something went wrong, try again");
  }
};

module.exports = {
  CreateScam,
  getAllScam,
  getSingleScam,
  deleteScam,
  likeScamPost,
  unLikeScamPost,
  getSearchedItems,
};
