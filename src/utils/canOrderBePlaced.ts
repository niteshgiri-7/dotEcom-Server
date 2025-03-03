import { Product } from "../models/product.js";
import { OrderItemsType } from "../types/orderTypes.js";

export const CanOrderBePlaced = async (orderedItems: OrderItemsType[]) => {
  const areProductsAvailable = Promise.all(
    orderedItems.map(async (product) => {
      const foundProduct = await Product.findById(product._id);
      return foundProduct;
    })
  );
  return areProductsAvailable;
};
