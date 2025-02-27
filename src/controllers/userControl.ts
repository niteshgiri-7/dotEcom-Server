import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/user.js";
import { IUploadImageRequest, NewUserRequestBody } from "../types/requestType.js";
import { invalidateCache } from "../utils/invalidateCache.js";
import admin from "../config/firebase.js";

export const signUp = TryCatch(
  async (req: Request<object, object, NewUserRequestBody>, res: Response,next:NextFunction): Promise<void> => {
 const newUserImage= req as IUploadImageRequest;
 const {uid,name,email,gender,DOB,role:roleOfNewPersonInReqBody} = req.body;
  
  const isAdminThereInSystem = await User.find({role:"admin"});
  
  if(isAdminThereInSystem && roleOfNewPersonInReqBody==="admin") return next(new ErrorHandler("Can't signUp,admin already exists!",401));
  

  const user= await User.create({
    _id:uid,
    name,
    email,
    gender,
    DOB,
    role:roleOfNewPersonInReqBody, 
    photo:{
    secure_url:newUserImage.fileUpload?.imageUrl,
    public_id:newUserImage.fileUpload?.publicId
    }
   });

   await admin.auth().setCustomUserClaims(uid as string,{role:roleOfNewPersonInReqBody})

    invalidateCache({admin:true})
    
    res.status(201).json({
      success: true,
      message: `Welcome ${req.body.name}`,
      user
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
