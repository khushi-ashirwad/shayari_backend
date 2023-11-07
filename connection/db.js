import mongoose from "mongoose";

const connection = () => {
  const mongoose_URl = "mongodb://127.0.0.1:27017/shayari&quotes";
  mongoose
    .connect(mongoose_URl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connect successfully"))
    .catch((error) => console.log("error", error));
};


export default connection