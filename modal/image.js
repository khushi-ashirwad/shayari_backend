import mongoose from "mongoose";

const imageschema = new mongoose.Schema(
  {
    name: String,
    issensitive: {
      type: Boolean,
      default: true,
    },
    description: { type: String, required: false },
    file: String,
    category: { type: mongoose.Schema.ObjectId, ref: "category" },
  },
  {
    timestamps: true,
  }
);

const image = mongoose.model("image", imageschema);

export default image;
