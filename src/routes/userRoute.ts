import express from "express"
import { getAllCustomers, signUp } from "../controllers/userControl.js";
import { authenticateUser, ensureAdminOnlyAccess } from "../middlewares/auth.js";
import { uploadImageViaMulter } from "../middlewares/multerUploadMiddleware.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";

 const userRoute = express.Router();

//  .../api/v1/user is the base url

userRoute.post("/signUp",uploadImageViaMulter,uploadToCloudinary,signUp);



userRoute.get("/get-all",authenticateUser,ensureAdminOnlyAccess,getAllCustomers);



export default userRoute;