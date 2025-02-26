import express from "express";
import { checkCouponValidity, CreateNewCoupon, deleteCoupon, getAllCoupons, } from "../controllers/paymentControl.js";
import { authenticateUser, ensureAdminOnlyAccess } from "../middlewares/auth.js";
const paymentRoute = express.Router();
paymentRoute.use(authenticateUser);
paymentRoute.post("/coupon/create-new", ensureAdminOnlyAccess, CreateNewCoupon);
//req.query=> ?coupon=
paymentRoute.get("/coupon/validate/:couponId", checkCouponValidity);
//TODO:admin only
paymentRoute.get("/get-all-coupons", getAllCoupons);
//TODO:admin only
paymentRoute.delete("/delete/coupon/:couponId", ensureAdminOnlyAccess, deleteCoupon);
export default paymentRoute;
