
const Verification = require("../models/verification")
const APIFeature = require("../utils/apifeature");
const Joi = require("joi");

// create scam request validation
const CreateVerificationValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  currency: Joi.string().required(),
  transactionAddress: Joi.string().required(),
  transactionDate: Joi.string().required(),
  request: Joi.string().required(),
});

// create new verification request
// access public,anyone can post a new verification request
 const CreateVerification = async (req, res) => {
  // validation before Post save
  const { error } = CreateVerificationValidation.validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  //   create new verification request from req.body
  const newverification = new Verification({
    name: req.body.name,
    email: req.body.email,
    currency: req.body.currency,
    transactionAddress: req.body.transactionAddress,
    transactionDate: req.body.transactionDate,
    request: req.body.request,
  });

  try {
    await newverification.save();
    res.status(201).send(newverification);
  } catch (error) {
    res.status(400).send("Something went wrong, try again!");
  }
};

// get all verification
// // access private,only an admin can create a scam post
const getAllVerification = async (req, res) => {
  const features = new APIFeature(Verification.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  try {
    const Verification = await features.query;
    res.send(Verification);
  } catch (error) {
    res.status(404).send("something went wrong, try again");
  }
};

module.exports = {
  CreateVerification,getAllVerification
}
