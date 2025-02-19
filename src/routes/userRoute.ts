import express from "express"
import { getAllCustomers, signUp } from "../controllers/userControl.js";

 const userRouter = express.Router();

userRouter.post("/signUp",signUp);

userRouter.get("/get-all",getAllCustomers);



export default userRouter;