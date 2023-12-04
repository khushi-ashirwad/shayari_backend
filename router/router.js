import express from "express";
import {
  dailyContentget,
  dailyquotesadd,
  dailyshayariadd,
  deleteQuotesshayari,
  getIdQuotes,
  getallcontant,
  manageQuotesShayari,
  updateQuotesshayari,
} from "../controller/quotes-controller.js";
import {
  addCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controller/category-controller.js";

const route = express.Router();
import multer from "multer";
import { addimage, deleteimage,  getimage,  updateimage } from "../controller/image-controller.js";

const Storage = multer.diskStorage({
  destination: function (request, file, cb) {
    // cb(null,path.join(__dirname, "../uploads"), function (error, success)
    cb(null, "uploads", function (error, success) {
      if (error) throw error;
    });
  },
  filename: function (request, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, function (error, success) {
      if (error) throw error;
    });
  },
});

const upload = multer({
  storage: Storage,
});
const imageStorage = multer.diskStorage({
  destination: function (request, file, cb) {
    // cb(null,path.join(__dirname, "../uploads"), function (error, success)
    cb(null, "imageupload", function (error, success) {
      if (error) throw error;
    });
  },
  filename: function (request, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, function (error, success) {
      if (error) throw error;
    });
  },
})
const imageupload = multer({
  storage:imageStorage,
});
route.post("/category/add", upload.single("file"), addCategory);
route.get("/category/get", getCategory);
route.put("/category/update/:id", upload.single("file"),updateCategory);
route.delete("/category/delete/:id", deleteCategory);

route.post("/quotesshayari/add", manageQuotesShayari);
route.get("/content/get", getallcontant);
route.get("/content/get/:id", getIdQuotes);
route.put("/content/update/:id", updateQuotesshayari);
route.delete("/content/delete/:id", deleteQuotesshayari);

route.route("/dailyquotes").post(dailyquotesadd).get(dailyContentget);
route.route("/dailyshayari").post(dailyshayariadd)
route.route('/image').post(imageupload.single("file"),addimage).get(getimage)
route.route('/image/:id').put(imageupload.single("file"),updateimage).delete(deleteimage)
export default route;
