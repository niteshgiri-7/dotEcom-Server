import { Document } from "mongoose";

export type NewCouponRequestBody = ICoupon;
export interface ICoupon extends Document{
    code:string;
    discountedAmount:number;
    maxRedemptionCount:number|string;
    expiresAt:Date;
    availableRedemptionCount?:number;
}