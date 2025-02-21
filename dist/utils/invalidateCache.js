import { myCache } from "../app.js";
import { Product } from "../models/product.js";
export const invalidateCache = async ({ product, admin, order, userId, coupon, couponCode, }) => {
    if (product) {
        const productKeys = ["latest", "categories", "all-products"];
        const products = await Product.find({}).select("_id");
        products.forEach((product) => productKeys.push(`product-${product._id}`));
        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [`order-${userId}`, "all-orders"];
        orderKeys.forEach((key) => myCache.del(key));
    }
    if (coupon && couponCode) {
        const couponKeys = [`coupon-${couponCode}`, "all-coupons"];
        couponKeys.forEach(key => myCache.del(key));
    }
    else if (coupon) {
        myCache.del("all-coupons");
    }
    if (admin) {
        myCache.del("chart-stats");
        myCache.del("admin-stats");
    }
};
