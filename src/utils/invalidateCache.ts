import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import {  InvalidateCachePropsType } from "../types/types.js"


export const invalidateCache = async({product,admin,order}:InvalidateCachePropsType)=>{
    if(product){
        const productKeys:string[] = ["latest","categories","all-products"];
        
        const products = await Product.find({}).select("_id");

        products.forEach(product=>productKeys.push(`product-${product._id}`));

        myCache.del(productKeys);
    }
}