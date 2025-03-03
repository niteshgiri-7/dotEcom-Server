import { Product } from "../models/product.js";
export const CanOrderBePlaced = async (orderedItems) => {
    const areProductsAvailable = Promise.all(orderedItems.map(async (product) => {
        const foundProduct = await Product.findById(product._id);
        return foundProduct;
    }));
    return areProductsAvailable;
};
