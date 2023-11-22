import mongoose from "mongoose";

const shayari = new mongoose.Schema(
  {
    shayari: String,
    category: { type: mongoose.Schema.ObjectId, ref: "category" },
  },
  {
    timestamps: true,
  }
);

const Shayari = mongoose.model("shayari",shayari)
export default Shayari;
