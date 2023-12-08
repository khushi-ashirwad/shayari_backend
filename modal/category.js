import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: String,
    description: { type: String, required: false },
    file: String,
    type: String,
    isdisable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


const Category = mongoose.model("category", categorySchema);

export default Category;
