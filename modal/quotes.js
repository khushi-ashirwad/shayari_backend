import mongoose from "mongoose";

const quotesSchema = new mongoose.Schema(
  {
    content: String,
    category: { type: mongoose.Schema.ObjectId, ref: "category" },
    type:{type:String,required:false}
  },
  {
    timestamps: true,
  }
);


const Quotes = mongoose.model("quotes", quotesSchema);
export default Quotes;
