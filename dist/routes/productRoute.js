import express from "express";
import { addNewProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct, getProductsByFilter, getProductCategories, getLatestProducts, } from "../controllers/productControl.js";
// import { isAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const productRoute = express.Router(); //product's route is -> /api/v1/products/...
productRoute.post("/add/:userId", singleUpload, addNewProduct);
productRoute.get("/all", getAllProducts);
productRoute.get("/categories", getProductCategories);
productRoute.get("/latest", getLatestProducts);
// .../api/v1/products/filter/?search=...&price=...&category=...&sort=...&page=...
productRoute.get("/filter", getProductsByFilter);
// .../api/v1/products/:userId/productId?=
productRoute
    .route("/:userId")
    .get(getProductDetails)
    .delete(deleteProduct)
    .put(singleUpload, updateProduct);
export default productRoute;
