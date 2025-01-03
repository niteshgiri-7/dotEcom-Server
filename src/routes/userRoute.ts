
import express from "express";
import { signUp } from "../controllers/userControl.js";
 
 export const userRoute = express.Router();

 userRoute.get("/signUp",signUp)