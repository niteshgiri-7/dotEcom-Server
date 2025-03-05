import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    shippingInfo: {
        type: {
            state: {
                type: String,
                required: [true, "State required"],
            },
            city: {
                type: String,
                required: [true, "City required"],
            },
            pinCode: {
                type: Number,
                required: [true, "Pin Code required"],
            },
            country: {
                type: String,
                required: [true, "Country required"],
            },
        },
        required: [true, "Shipping information is required"], // This makes the entire object required
    },
    status: {
        type: String,
        enum: ["processing", "shipped", "delivered"],
        default: "processing",
    },
    orderedBy: {
        type: String,
        ref: "User",
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    orderedItems: [
        {
            _id: {
                type: String,
                ref: "Product",
                required: true
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true
            },
            stock: {
                type: Number
            },
            photo: {
                secure_url: {
                    type: String,
                    required: [true, "photo secure_url needed"]
                },
                public_id: {
                    type: String,
                    required: [true, "public_id required"]
                }
            },
            quantity: {
                type: Number,
                required: true
            },
        }
    ],
}, {
    timestamps: true,
});
export const Order = mongoose.model("Order", orderSchema);
