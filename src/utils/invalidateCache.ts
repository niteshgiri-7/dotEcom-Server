import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidateCachePropsType } from "../types/controllerType.js";

export const invalidateCache = async ({
  product,
  admin,
  order,
  userId,
  coupon,
  couponCode,
}: InvalidateCachePropsType) => {
  if (product) {
    const productKeys: string[] = ["latest", "categories", "all-products"];

    const products = await Product.find({}).select("_id");

    products.forEach((product) => productKeys.push(`product-${product._id}`));

    myCache.del(productKeys);
  }

  if (order) {
    const orderKeys:string[] = [`order-${userId}`, "all-orders"];
    orderKeys.forEach((key) => myCache.del(key));
  }

  if(coupon && couponCode){
    const couponKeys:string[] =[`coupon-${couponCode}`,"all-coupons"]
     couponKeys.forEach(key=>myCache.del(key));
  }
  else if(coupon){
    myCache.del("all-coupons")
  }
};
