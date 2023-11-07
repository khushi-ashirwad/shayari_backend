import mongoose from "mongoose";

const quotesSchema = new mongoose.Schema(
  {
    customeId: Number,
    quotes: String,
    category: String,
  },
  {
    timestamps: true,
  }
);

const Quotes = mongoose.model("quotes", quotesSchema);
export default Quotes;
