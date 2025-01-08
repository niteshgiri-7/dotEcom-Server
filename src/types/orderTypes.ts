import { Types } from "mongoose";


export type ShippingInfoType={
  state:string;
  city:string;
  country:string;
  pinCode:number;
}

export interface OrderItemsType {
    name:string;
    photo:string;
    quantity:string|number;
    price:number;
    productId:string|number;

}

 export interface NewOrderRequestBody  {
    shippingInfo:ShippingInfoType;
    status:"processing"| "pending payment"| "delivered";
    deliveryCharge:Number;
    discount:Number;
    total:Number;
    orderedBy:string;
    orderedItems:OrderItemsType[];
 }