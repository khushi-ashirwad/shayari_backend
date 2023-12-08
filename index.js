import express from "express";
import cors from "cors";
import connection from "./connection/db.js";
import bodyParser from "body-parser";
import route from "./router/router.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", route);
app.use(express.static('uploads'))
app.use(express.static('imageupload'))
connection();

app.listen(PORT, () => console.log(`Running server ${PORT}`));
