import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
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
        trim: true,
    },
}, {
    timestamps: true,
});
export const Product = mongoose.model("Product", productSchema);
