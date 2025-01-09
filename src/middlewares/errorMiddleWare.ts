import { NextFunction, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";



const errorMiddleWare = (error:ErrorHandler ,req:Request,res:Response,next:NextFunction):Response<any, Record<string, any>>=>{
   error.message||="Something went wrong";
   error.statusCode||=500;
   
   if(error.name==="CastError") error.message="Invalid ID"
   if(error.name==="ValidationError") error.message="Unexpected type of Data"
   return res.status(error.statusCode).json({
    message:error.message,
    success:false
   })
}


export default errorMiddleWare;

