import mongoose from "mongoose";
import { ProductType } from "../types/controllerType.js";

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: [true, "Enter Product's Id"],
    },
    name: {
      type: String,
      required: [true, "Enter product name"],
    },
    photo: {
      type: String,
      required: [true, "Add Photo"],
    },
    price: {
      type: Number,
      required: [true, "Enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Enter stock available"],
    },
    category: {
      type: String,
      required: [true, "Enter category of the product"],
      trim:true,
    },
  },
  {
    timestamps: true,
    _id:false,
  }
);

export const Product = mongoose.model<ProductType>("Product", productSchema);
