// to update the stock of the product as new orders get placed
import { Product } from "../models/product.js";
export const updateStock = async (orderedItems, operation) => {
    try {
        for (let i = 0; i < orderedItems.length; i++) {
            const order = orderedItems[i];
            const product = await Product.findById(order._id);
            if (!product)
                throw new Error("product not found");
            if (operation === "decrease")
                product.stock -= Number(order.quantity);
            else
                product.stock += Number(order.quantity);
            await product.save();
        }
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
