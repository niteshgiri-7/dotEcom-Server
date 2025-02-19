import { Document } from "mongoose";

export type NewCouponRequestBody = ICoupon;
export interface ICoupon extends Document{
    code:string;
    discountedAmount:number|string;
    maxRedemptionCount:number|string;
    expiresAt:Date|string;
    availableRedemptionCount?:number;
}