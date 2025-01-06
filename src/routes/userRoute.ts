import express from "express"
import { signUp } from "../controllers/userControl.js";

 const userRouter = express.Router();

userRouter.get("/add",signUp)

export default userRouter;