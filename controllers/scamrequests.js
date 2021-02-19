const ScamRequest = require("../models/scamrequests");
const APIFeature = require("../utils/apifeature");
const Joi = require("joi");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();

// create scam request validation
const CreateScamRequestValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  link: Joi.string().required(),
});

// create new scam request
// access private,only a logged in user can create a request
const CreateScamRequest = async (req, res) => {
  // validation before Post save
  const { error } = CreateScamRequestValidation.validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  //   get description from req.body and markdowned it

  const requestDescription = req.body.description;
  const markdownedDescription = md.render(`${requestDescription}`);

  //   create new scam request from req.body and req.user
  const newscamrequest = new ScamRequest({
    name: req.body.name,
    description: markdownedDescription,
    type: req.body.type,
    link: req.body.link,
    author: req.user.id,
  });

  try {
    await newscamrequest.save();
    res.status(201).send(newscamrequest);
  } catch (error) {
    res.status(400).send("Something went wrong, try again!");
  }
};

// get all scam requests
// access admin,only an admin can get all requests
const getAllScamRequests = async (req, res) => {
  const features = new APIFeature(ScamRequest.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  try {
    const ScamRequest = await features.query.populate("author").exec();
    res.send(ScamRequest);
  } catch (error) {
    res.status(404).send("something went wrong, try again");
  }
};

// get single scam request from id
// access admin,only an admin can get single requests details
const getSingleScamRequest = async (req, res) => {
  try {
    const singleScamRequest = await ScamRequest.findById(req.params.id)
      .populate("author")
      .exec();
    if (!singleScamRequest) {
      return res.send("ScamRequest not found!");
    }
    res.send(singleScamRequest);
  } catch (error) {
    res.status(404).send("ScamRequest not found!");
  }
};

// delete request endpoint
// access admin,only an admin can delete a request
const deleteScamRequest = async (req, res) => {
  try {
    const ToDeleteScamRequest = await ScamRequest.findByIdAndDelete(
      req.params.id
    );
    if (!ToDeleteScamRequest) {
      return res.send("ScamRequest not found!");
    }
    res.send("ScamRequest Successfully Deleted");
  } catch (error) {
    res.status(404).send("ScamRequest not found!");
  }
};

module.exports = {
  CreateScamRequest,
  getAllScamRequests,
  getSingleScamRequest,
  deleteScamRequest,
};
