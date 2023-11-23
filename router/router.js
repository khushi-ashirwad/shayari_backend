import express from "express";
import {
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
import {
  getAllshayari,
  getIdshayari,
} from "../controller/shayari-controller.js";

const route = express.Router();
import multer from "multer";

const Storage = multer.diskStorage({
  destination: function (request, file, cb) {
    // cb(null,path.join(__dirname, "../uploads"), function (error, success) 
    cb(null, 'uploads',function (error, success)
    {
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

route.post("/category/add", upload.single("file"), addCategory);
route.get("/category/get", getCategory);
route.put("/category/update/:id", updateCategory);
route.delete("/category/delete/:id", deleteCategory);

route.post("/quotesshayari/add", manageQuotesShayari);
route.get("/content/get", getallcontant);
route.get("/quotes/get/:id", getIdQuotes);
route.put("/content/update/:id", updateQuotesshayari);
route.delete("/content/delete/:id", deleteQuotesshayari);

route.get("/shayari/get", getAllshayari);
route.get("/shayari/get/:id", getIdshayari);
export default route;
