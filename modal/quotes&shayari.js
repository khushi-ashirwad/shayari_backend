import mongoose from "mongoose";

const quotesshayariSchema = new mongoose.Schema(
  {
    content: String,
    category: { type: mongoose.Schema.ObjectId, ref: "category" },
    type:{type:String,required:false}
  },
  {
    timestamps: true,
  }
);

const Quotesshyari = mongoose.model("quotes&shayari", quotesshayariSchema);
export default Quotesshyari;
