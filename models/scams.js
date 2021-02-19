// importing dependency
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const slugify = require("slugify");

// creating scamrequest model
const scamSchema = new Schema({
  title: {
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
    type: String,
    required: true,
  },
  slug: { type: String },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
},
  {
    timestamps: true,
  });

scamSchema.pre("save", function (next) {
  const scam = this;
  scam.slug = slugify(scam.title, {
    lower: true,
    strict: true,
  });
  next();
});

const Scam = model("Scam", scamSchema);
module.exports = Scam;
