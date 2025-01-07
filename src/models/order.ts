import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      state: {
        type: String,
        required: [true, "State required"],
      },
      city: {
        type: String,
        required: [true, "city required"],
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
    status: {
      type: String,
      enum: ["pending payment","processing","shipped","delivered"],
      default: "pending payment",
    },
    orderedBy: {
      type: String,
      ref: "User",
      required: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    orderedItems: [
      {
        name: String,
        photo: String,
        quantity: Number,
        price: Number,
        productId: {
          type: Number,
          ref: "Product",
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
