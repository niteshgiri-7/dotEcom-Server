import { User } from "../models/user.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";

export const isAdmin =TryCatch(async(req,res,next)=>{
    console.log("hello")
    const id = req.params.userId;
    const user = await User.findOne({_id:id}).select("role") as {_id:string,role:string} |null;
    if(!user) return next(new ErrorHandler("user doesn't exist",400));
    if(user.role!=="admin") return next(new ErrorHandler("Admin only access",400));
    next();
})