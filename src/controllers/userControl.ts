import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/User.js";
import { NewRequestBody } from "../types/types.js";

export const signUp = TryCatch(
  async (req: Request<{}, {}, NewRequestBody>, res: Response, next: NextFunction): Promise<void> => {
    const { _id } = req.body;

    const user = await User.findById(_id);
    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }

    await User.create(req.body);

    res.status(201).json({
      success: true,
      message: `Welcome ${req.body.name}`,
    });
  }
);
