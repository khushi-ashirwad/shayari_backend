import express from "express";
import {
  deleteQuotes,
  getIdQuotes,
  getallQuotes,
  manageQuotes,
  updateQuotes,
} from "../controller.js/quotes-controller.js";
import {
  addCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controller.js/category-controller.js";
import {
  addShayari,
  deleteShyari,
  getAllshayari,
  getIdshayari,
  updateShyari,
} from "../controller.js/shayari-controller.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

route.post("/quotes/add", manageQuotes);
route.get("/quotes/get", getallQuotes);
route.get("/quotes/get/:id", getIdQuotes);
route.put("/quotes/update/:id", updateQuotes);
route.delete("/quotes/delete/:id", deleteQuotes);

route.post("/shayari/add", addShayari);
route.get("/shayari/get", getAllshayari);
route.get("/shayari/get/:id", getIdshayari);
route.put("/shayari/update/:id", updateShyari);
route.delete("/shayari/delete/:id", deleteShyari);
export default route;
