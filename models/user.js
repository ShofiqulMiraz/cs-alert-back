// importing dependency
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs")

// creating User model
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    select: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  passwordIssueTime: {
    type: Date,
  },
});

// hashing password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  //   hash password with a cost of 12
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }

  next();
});

// comparing password for login
userSchema.methods.comparePassword = async function (
  candidatePassword,
  storedPassword
) {
  return await bcrypt.compare(candidatePassword, storedPassword);
};

// checking if password changed after jwt issued time

userSchema.methods.passwordChagedAfterJWT = function (JWTIssueTime) {
  const user = this;
  if (user.passwordIssueTime) {
    const passwordIssueTime = parseInt(
      user.passwordIssueTime.getTime() / 1000,
      10
    );
    return passwordIssueTime > JWTIssueTime;
  }

  return false;
};

// exporting User model
const User = model("User", userSchema);

module.exports = User;
