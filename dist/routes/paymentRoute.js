import express from "express";
import { checkCouponValidity, CreateNewCoupon, deleteCoupon, getAllCoupons, } from "../controllers/paymentControl.js";
const paymentRoute = express.Router();
//TODO:admin only
paymentRoute.post("/coupon/create-new", CreateNewCoupon);
//req.query=> ?coupon=
paymentRoute.get("/coupon/validate", checkCouponValidity);
//TODO:admin only
paymentRoute.get("/get-all-coupons", getAllCoupons);
//TODO:admin only
paymentRoute.delete("/delete/coupon/:id", deleteCoupon);
export default paymentRoute;
