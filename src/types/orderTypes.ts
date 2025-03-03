import { ShippingInfoType } from "./modelType.js";


export interface OrderItemsType {
    name:string;
    photo:string;
    quantity:string|number;
    price:number;
    _id:string|number;
}

 export interface NewOrderRequestBody  {
    shippingInfo:ShippingInfoType;
    status:"processing"| "pending payment"| "delivered";
    deliveryCharge:number;
    discount:number;
    total:number;
    orderedItems:OrderItemsType[];
 }