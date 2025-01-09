import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
        name: {
          type:String,
          required:true,
        },

          photo:{
            type: String,
            required:true,
        },
        quantity:{
          type:Number,
          required:true
        },
        price:{
          type:Number,
          required:true
        } ,
        productId: {
          type: Number,
          ref: "Product",
          required:true
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
