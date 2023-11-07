import mongoose from "mongoose";

const quotesSchema = new mongoose.Schema(
  {
    quotes: String,
    category: { type: mongoose.Schema.ObjectId, ref: "category" },
  },
  {
    timestamps: true,
  }
);

const Quotes = mongoose.model("quotes", quotesSchema);
export default Quotes;
