// to update the stock of the product as new orders get placed

import { Product } from "../models/product.js";
import { OrderItemsType } from "../types/orderTypes.js";

export const updateStock = async (
  orderedItems: OrderItemsType[],
  operation: "increase"|"decrease"
): Promise<boolean | undefined> => {
  try {
    for (let i = 0; i < orderedItems.length; i++) {
      const order = orderedItems[i];
      const product = await Product.findById(
        order.productId
      );
      console.log(product)
      if (!product) throw new Error("product not found");
      operation === "decrease"
        ? (product.stock -= Number(order.quantity))
        : (product.stock += Number(order.quantity));
      await product.save();
      return true;
    }
  } catch (error) {
    console.log(error)
    return false;
  }
};
