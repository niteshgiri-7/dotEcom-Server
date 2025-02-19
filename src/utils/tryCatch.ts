import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/controllerType.js";
import deletePhotoOnError from "./deletePhoto.js";

export const TryCatch = (func: ControllerType) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await func(req, res, next);
    } catch (error) {
      if (req?.file?.path) {
        deletePhotoOnError(req.file.path);
      }
      next(error);
    }
  };
};
