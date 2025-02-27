import cloudinary from "../config/cloudinaryConfig.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
const uploadToCloudinary = TryCatch(async (req, res, next) => {
    if (!req.file || !req.file.buffer)
        return next(new ErrorHandler("No file uploaded", 400));
    const base64Image = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
    const result = await cloudinary.uploader.upload(dataUri, {
        folder: "dotEcomImages",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
    });
    req.fileUpload = { imageUrl: result.secure_url, publicId: result.public_id };
    next();
});
export default uploadToCloudinary;
