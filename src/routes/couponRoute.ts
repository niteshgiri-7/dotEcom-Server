import express from "express";
import {
  checkCouponValidity,
  CreateNewCoupon,
  deleteCoupon,
  getAllCoupons,
} from "../controllers/couponControl.js";
import { authenticateUser, ensureAdminOnlyAccess } from "../middlewares/auth.js";

const couponRoute = express.Router();

couponRoute.use(authenticateUser);

couponRoute.post("/create-new",ensureAdminOnlyAccess, CreateNewCoupon);


couponRoute.get("/validate/:couponId", checkCouponValidity);

couponRoute.get("/get-all", getAllCoupons);

couponRoute.delete("/delete/:couponId",ensureAdminOnlyAccess, deleteCoupon);

export default couponRoute;
