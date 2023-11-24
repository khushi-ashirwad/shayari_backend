import mongoose from "mongoose";

const imageschema = new mongoose.Schema(
  {
    name: String,
    issensitive: {
      type: Boolean,
      default: true,
    },
    description: String,
    file: String,
  },
  {
    timestamps: true,
  }
);

const image = mongoose.model("image", imageschema);

export default image;
