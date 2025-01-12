import { Request } from "express";
import { TryCatch } from "../../utils/tryCatch.js";
import { myCache } from "../../app.js";

export const cachedStats = TryCatch(async(req:Request, res , next)=>{
    if(myCache.has("admin-stats")){
        const stats = JSON.parse(myCache.get("admin-stats")as string);
        return res.status(200).json({
            success:true,
            stats
        });
    
    }
    next();
})