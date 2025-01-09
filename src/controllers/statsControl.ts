import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { StatsType } from "../types/requestType.js";
import { TryCatch } from "../utils/tryCatch.js";


export const getDashboardStats = TryCatch(async(req , res , next)=>{

    const stats:StatsType= req.stats;

    res.status(200).json({
        success:true,
        stats
    })
   

})