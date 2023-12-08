import express from "express";
import {
  dailyContentget,
  dailyquotesadd,
  dailyshayariadd,
  deleteQuotes,
  getIdQuotes,
  getallquotes,
  manageQuotes,
  updateQuotes,
} from "../controller/quotes-controller.js";
import {
  addCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controller/category-controller.js";

const route = express.Router();
import multer from "multer";
import { addimage, deleteimage,  getIdimage,  getimage,  updateimage } from "../controller/image-controller.js";
import { addShayari, deleteShayari, getIdShayari, getShayari, updateShayari } from "../controller/shayari-controller.js";

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

route.route("/category").post(upload.single("file"),addCategory).get(getCategory)
route.route("/category/:id").put(upload.single("file"),updateCategory).delete(deleteCategory)

route.route("/quotes").post(manageQuotes).get(getallquotes)
route.route("/quotes/:id").get(getIdQuotes).put(updateQuotes).delete(deleteQuotes);

route.route("/shayari").post(addShayari).get(getShayari)
route.route("/shayari/:id").get(getIdShayari).put(updateShayari).delete(deleteShayari)

route.route('/image').post(imageupload.single("file"),addimage).get(getimage)
route.route('/image/:id').get(getIdimage).put(imageupload.single("file"),updateimage).delete(deleteimage)
 
route.route("/dailyquotes").post(dailyquotesadd).get(dailyContentget);
route.route("/dailyshayari").post(dailyshayariadd)

export default route;
