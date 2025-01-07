import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidateCachePropsType } from "../types/types.js";

export const invalidateCache = async ({
  product,
  admin,
  order,
  userId,
}: InvalidateCachePropsType) => {
  if (product) {
    const productKeys: string[] = ["latest", "categories", "all-products"];

    const products = await Product.find({}).select("_id");

    products.forEach((product) => productKeys.push(`product-${product._id}`));

    myCache.del(productKeys);
  }

  if (order) {
    const orderKeys:string[] = [`order-${userId}`, "all-orders"];
    console.log(orderKeys)
    orderKeys.forEach((key) => myCache.del(key));
  }
};
