import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/requestType.js";
import { invalidateCache } from "../utils/invalidateCache.js";
import admin from "../config/firebase.js";

export const signUp = TryCatch(
  async (req: Request<object, object, NewUserRequestBody>, res: Response,next:NextFunction): Promise<void> => {

 const {id:uid,name,email,gender,DOB,role} = req.body;
  
  const isAdminThereInSystem = await User.find({role:"admin"});
  
  if(isAdminThereInSystem && role==="admin") return next(new ErrorHandler("Can't signUp,admin already exists!",401));
  

   await User.create({
    _id:uid,
    name,
    email,
    gender,
    DOB,
    role, 
    photo:req.file?.path
   });

   await admin.auth().setCustomUserClaims(uid as string,{role})

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
