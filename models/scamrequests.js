// importing dependency
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// creating scamrequest model
const scamRequestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
},
  {
    timestamps: true,
  });

const ScamRequest = model("ScamRequest", scamRequestSchema);

module.exports = ScamRequest;
