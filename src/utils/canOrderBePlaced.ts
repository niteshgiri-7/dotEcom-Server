import { isValidObjectId } from "mongoose";
import { Product } from "../models/product.js";
import ErrorHandler from "./utility-class.js";
import { OrderItemsType } from "../types/orderTypes.js";

export const CanOrderBePlaced = async (orderedItems: OrderItemsType[]) => {
  const areProductsAvailable = Promise.all(
    orderedItems.map(async (product) => {
      const foundProduct = await Product.findById(product.productId);
      return foundProduct;
    })
  );
  return areProductsAvailable;
};
