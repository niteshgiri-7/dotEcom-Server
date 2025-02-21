import { Product } from "../models/product.js";
export const CanOrderBePlaced = async (orderedItems) => {
    const areProductsAvailable = Promise.all(orderedItems.map(async (product) => {
        const foundProduct = await Product.findById(product.productId);
        return foundProduct;
    }));
    return areProductsAvailable;
};
