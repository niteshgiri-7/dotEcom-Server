import cloudinary from "../config/cloudinaryConfig.js";
export const TryCatch = (func) => {
    return async function (req, res, next) {
        const imageReq = req;
        try {
            await func(req, res, next);
        }
        catch (error) {
            if (imageReq.fileUpload) {
                await cloudinary.uploader.destroy(imageReq.fileUpload.publicId);
                console.log("file deleted from cloudinary after error");
            }
            next(error);
        }
    };
};
