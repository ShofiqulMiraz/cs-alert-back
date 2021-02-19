// importing dependency
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Joi = require("joi");

// register and login validation by Joi
const registerValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});
const loginValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

// register new user
const register = async (req, res) => {
  // checking validation for user input
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  // checking if user email is already registerd
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(404).send("Email Already Exists!");
  }

  // creating new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // allocating jsonwebtoken for the user
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  try {
    // saving user and sending response to client
    await user.save();
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(404).send("Something Went Wrong. Try Again!");
  }
};

// login user

const login = async (req, res) => {
  // checking if email and password provided
  const { error } = loginValidation.validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  try {
    // checking if the user exist and password is correct
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return res.status(404).send("Invalid id or password");
    }
    const password = await user.comparePassword(
      req.body.password,
      user.password
    );
    if (!password) {
      return res.status(404).send("Invalid id or password");
    }

    // allocating jsonwebtoken for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // sending response to the client
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(404).send("Something Went Wrong. Try Again!");
  }
};

// protect unauthorized routes

const protect = async (req, res, next) => {
  try {
    // 1. getting token from the user
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).send("You have to login to access this route");
    }

    // 2. checking if the token is valid: validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3.checking if the user is still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).send("User may be deleted! Try Login Again");
    }

    // 4. checking if the user changed password after JWT issued
    const JWTIssueTime = decoded.iat;
    if (currentUser.passwordChagedAfterJWT(JWTIssueTime)) {
      return res
        .status(401)
        .send("User recently changed password! Try login Again");
    }

    // putting current user on middleware stack as req.user
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).send("Something Went Wrong, Please Login Again");
  }
};

// restrict some access for admin

const restrict = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .send("You don't have permission to perform this action");
  }
  next();
};

module.exports = {
  register,
  login,
  protect,
  restrict,
};
