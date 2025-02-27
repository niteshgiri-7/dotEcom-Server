import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter product name"],
    },
    photo: {
        secure_url: {
            type: String,
            required: [true, "Enter secure_url of image"]
        },
        public_id: {
            type: String,
            required: [true, "Enter public_id of image"]
        }
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
