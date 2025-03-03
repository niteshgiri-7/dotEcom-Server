import { Router } from "express";
import { InitiatePayment, VerifyPayment } from "../controllers/paymentControl.js";
import { authenticateUser } from "../middlewares/auth.js";

const paymentRoute = Router();


paymentRoute.use(authenticateUser);

paymentRoute.use("/initiate",InitiatePayment);

paymentRoute.use("/verify",VerifyPayment);


export default paymentRoute;