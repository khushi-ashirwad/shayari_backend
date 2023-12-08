import mongoose from "mongoose";

const shayariSchema = new mongoose.Schema(
  {
    content: String,
    category: { type: mongoose.Schema.ObjectId, ref: "category" },
    type:{type:String,required:false}
  },
  {
    timestamps: true,
  }
);

const Shayari = mongoose.model("shayari", shayariSchema);
export default Shayari;
