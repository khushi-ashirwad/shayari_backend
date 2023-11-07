import mongoose from "mongoose";

const category = new mongoose.Schema(
  {
    name: String,
    description: String,
    image:String
  },
  { timestamps: true }
);

const Category = mongoose.model("category", category);

export default Category;
