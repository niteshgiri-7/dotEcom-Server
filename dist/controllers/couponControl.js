import { myCache } from "../app.js";
import { Coupon } from "../models/coupon.js";
import { invalidateCache } from "../utils/invalidateCache.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
export const CreateNewCoupon = TryCatch(async (req, res, next) => {
    const coupon = await Coupon.findOne({ code: req.body.code });
    if (coupon)
        return next(new ErrorHandler("Coupon Code already exists", 409));
    const newCoupon = await Coupon.create(req.body);
    invalidateCache({ coupon: true });
    return res.status(200).json({
        success: true,
        message: "Coupon created successfully!",
        newCoupon,
    });
});
export const checkCouponValidity = TryCatch(async (req, res, next) => {
    const { couponId: id } = req.params;
    const key = `coupon-${id}`;
    let coupon;
    if (myCache.has(key)) {
        coupon = JSON.parse(myCache.get(key));
    }
    else {
        coupon = await Coupon.findById(id);
        if (!coupon)
            return next(new ErrorHandler("Coupon not found", 404));
        const isReedemAvailable = coupon?.availableRedemptionCount > 0;
        const isExipred = coupon.expiresAt.getTime() < Date.now();
        if (!isReedemAvailable || isExipred)
            return next(new ErrorHandler("Coupon validation failed", 400));
        myCache.set(key, JSON.stringify(coupon));
    }
    return res.status(200).json({
        success: true,
        message: "Coupon is valid and can be used",
        discountAmount: coupon.discountedAmount,
    });
});
export const getAllCoupons = TryCatch(async (req, res, next) => {
    const key = "all-coupons";
    let coupons;
    if (myCache.has(key)) {
        coupons = JSON.parse(myCache.get(key));
    }
    else {
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
    if (!coupon)
        return next(new ErrorHandler("Coupon not found", 404));
    invalidateCache({ coupon: true, couponCode: coupon.code });
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} deleted successfully`,
    });
});
