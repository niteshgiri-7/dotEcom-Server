import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../utils/tryCatch.js";
import { NewCouponRequestBody } from "../types/couponType.js";
import ErrorHandler from "../utils/utility-class.js";
import { Coupon } from "../models/coupon.js";
import { log } from "console";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/invalidateCache.js";

export const CreateNewCoupon = TryCatch(
  async (
    req: Request<{}, {}, NewCouponRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { code, discountedAmount } = req.body;

    if (!code || !discountedAmount)
      return next(new ErrorHandler("Incomplete Data", 400));

    const coupon = await Coupon.findOne({ code: code });

    if (coupon)
      return next(new ErrorHandler("Coupon Code already exists", 409));

    const newCoupon = await Coupon.create(req.body);
     invalidateCache({coupon:true})
    return res.status(200).json({
      success: true,
      message: "Coupon created successfully!",
      newCoupon,
    });
  }
);

export const checkCouponValidity = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  const key = `coupon-${coupon}`;
  let discount;

  if (!coupon) return next(new ErrorHandler("Coupon required", 404));

  if (myCache.has(key)) {
    discount = JSON.parse(myCache.get(key) as string);
  } else {
    discount = await Coupon.findOne({ code: coupon }).select(
      "discountedAmount"
    );

    if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));

    myCache.set(key, JSON.stringify(discount));
  }

  return res.status(200).json({
    success: true,
    discount,
  });
});

export const getAllCoupons = TryCatch(async (req, res, next) => {
  const key = "all-coupons";
  let coupons;

  if (myCache.has(key)) {
    coupons = JSON.parse(myCache.get(key) as string);
  } else {
    coupons = await Coupon.find({});

    if (coupons.length === 0)
      return next(new ErrorHandler("Coupons not created yet", 404));

    myCache.set(key, JSON.stringify(coupons));
  }

  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));

  invalidateCache({ coupon: true, couponCode: coupon.code });

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} deleted successfully`,
  });
});
