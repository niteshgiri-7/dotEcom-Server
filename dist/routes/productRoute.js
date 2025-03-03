import express from "express";
import { addNewProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct, getProductsByFilter, getProductCategories, getLatestProducts, } from "../controllers/productControl.js";
import { authenticateUser, ensureAdminOnlyAccess } from "../middlewares/auth.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import { uploadImageViaMulter } from "../middlewares/multerUploadMiddleware.js";
const productRoute = express.Router(); //product's route is -> /api/v1/products/...
// .../api/v1/products is the base url
productRoute.get("/all", getAllProducts);
productRoute.use(authenticateUser);
productRoute.get("/latest", getLatestProducts);
productRoute.get("/categories", getProductCategories);
// .../api/v1/products/filter/?search=...&price=...&category=...&sort=...&page=...
productRoute.get("/filter", getProductsByFilter);
productRoute.post("/add-new", ensureAdminOnlyAccess, uploadImageViaMulter, uploadToCloudinary, addNewProduct);
productRoute
    .route("/:productId")
    .get(getProductDetails)
    .delete(ensureAdminOnlyAccess, deleteProduct)
    .put(ensureAdminOnlyAccess, uploadImageViaMulter, uploadToCloudinary, updateProduct);
export default productRoute;
