
import express from "express";
import { addNewProduct } from "../controllers/productControl.js";
import { isAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

export const productRoute = express.Router();//product's route is -> /api/v1/products/...
//id =user's id
productRoute.post("/add/:id",isAdmin,singleUpload,addNewProduct);