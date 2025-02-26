import express from "express";

import {
  addNewProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  getProductsByFilter,
  getProductCategories,
  getLatestProducts,
} from "../controllers/productControl.js";

import { singleUpload } from "../middlewares/multer.js";

import { authenticateUser, ensureAdminOnlyAccess } from "../middlewares/auth.js";

const productRoute = express.Router(); //product's route is -> /api/v1/products/...


// .../api/v1/products is the base url

productRoute.get("/all", getAllProducts);

productRoute.get("/latest", getLatestProducts);

productRoute.get("/categories", getProductCategories);

// .../api/v1/products/filter/?search=...&price=...&category=...&sort=...&page=...
productRoute.get("/filter", getProductsByFilter);



productRoute.use(authenticateUser);

productRoute.post("/add-new",ensureAdminOnlyAccess, singleUpload, addNewProduct);


productRoute
  .route("/:productId")
  .get(getProductDetails)
  .delete(ensureAdminOnlyAccess, deleteProduct)
  .put(ensureAdminOnlyAccess, singleUpload, updateProduct);

export default productRoute;
