import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:[true,"Coupon Code is required"],
        unique:[true,"Coupon Code already exists"]
    },
    discountedAmount:{
        type:Number,
        required:[true,"Discounted Amount is required"]
    }
})

export const Coupon  = mongoose.model("Coupon",couponSchema);