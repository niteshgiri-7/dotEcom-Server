import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/controllerType.js";
import { IUploadImageRequest } from "../types/requestType.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const TryCatch = (func: ControllerType) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    const imageReq = req as IUploadImageRequest;
    try {
      await func(req, res, next);
    } catch (error) {
      if(imageReq.fileUpload){
        await cloudinary.uploader.destroy(imageReq.fileUpload.publicId);
        console.log("file deleted from cloudinary after error");
      }
      next(error);
    }
  };
};
