import { Order } from "../models/order.js"
import { IinitiatePaymentRequestBody } from "../types/requestType.js";

const createOrder = async(order:IinitiatePaymentRequestBody)=>{
    try{
       const createdOrder = await Order.create(order);
       console.log("ordered created by ",createdOrder.orderedBy,`at ${Date.now()}`);
    }
    catch(error){
        console.log(error)

    }
};

export default createOrder;