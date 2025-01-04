import express from "express"
import { signUp } from "../controllers/userControl.js";

export const userRouter = express.Router();

userRouter.get("/user",signUp)

