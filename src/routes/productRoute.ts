
import express from "express";
import { addNewProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct ,getProductsByFilter, getProductCategories, getLatestProducts} from "../controllers/productControl.js";
import { isAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const productRoute = express.Router();//product's route is -> /api/v1/products/...
//id =user's id
productRoute.post("/add/:userId",isAdmin,singleUpload,addNewProduct);

productRoute.get("/all",getAllProducts);


productRoute.get("/categories",getProductCategories);

productRoute.get("/search",getProductsByFilter)

productRoute.get("/latest",getLatestProducts);

productRoute.route("/:userId").get(getProductDetails).delete(isAdmin,deleteProduct).put(isAdmin,singleUpload,updateProduct);

export default productRoute;