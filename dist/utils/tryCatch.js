import deletePhotoOnError from "./deletePhoto.js";
export const TryCatch = (func) => {
    return async function (req, res, next) {
        try {
            await func(req, res, next);
        }
        catch (error) {
            if (req?.file?.path) {
                deletePhotoOnError(req.file.path);
            }
            next(error);
        }
    };
};
