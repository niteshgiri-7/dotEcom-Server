import mongoose from "mongoose";
import validator from "validator";
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Coupon Code is required"],
        unique: true,
        trim: true,
        validate: {
            validator: (value) => validator.isAlphanumeric(value),
            message: "Coupon Code must be alphanumeric"
        }
    },
    discountedAmount: {
        type: Number,
        required: [true, "Discounted Amount is required"],
        min: [1, "Discounted Amount must be greater than 0"]
    },
    expiresAt: {
        type: Date,
        required: [true, "Enter Expiry Date"],
        validate: {
            validator: (value) => value > new Date(),
            message: "Expiry date must be in the future"
        }
    },
    maxRedemptionCount: {
        type: Number,
        required: [true, "Enter maximum redemption count"],
        min: [1, "Redemption count must be at least 1"]
    },
    availableRedemptionCount: {
        type: Number,
        default: function () {
            return this.maxRedemptionCount;
        }
    }
});
export const Coupon = mongoose.model("Coupon", couponSchema);
