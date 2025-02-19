import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/requestType.js";
import { invalidateCache } from "../utils/invalidateCache.js";

export const signUp = TryCatch(
  async (req: Request<{}, {}, NewUserRequestBody>, res: Response, next: NextFunction): Promise<void> => {
    const {name,DOB,email,gender,photo,role} = req.body;

    const user = await User.findOne({email:email});
    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }
    if(!name || !DOB || !email || !gender || !photo || !role) return next(new Error("Incomplete Data"))
    await User.create(req.body);
       
    invalidateCache({admin:true})
    res.status(201).json({
      success: true,
      message: `Welcome ${req.body.name}`,
    });
  }
);

export const getAllCustomers = TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
  const allCustomers = await User.find({});
  if(!allCustomers) return next(new ErrorHandler("No customers Found",404));

  res.status(200).json({
    success:true,
    allCustomers
  })
})
