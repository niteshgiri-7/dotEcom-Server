import express from "express"
import { getAllCustomers, signUp } from "../controllers/userControl.js";
import { singleUpload } from "../middlewares/multer.js";

 const userRouter = express.Router();

userRouter.post("/signUp",singleUpload,signUp);

userRouter.get("/get-all",getAllCustomers);



export default userRouter;