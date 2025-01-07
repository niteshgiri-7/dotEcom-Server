
export type ShippingInfoType={
  state:string;
  city:string;
  country:string;
  pinCode:number;
}

export type OrderItemsType ={
    name:string;
    photo:string;
    quantity:string;
    price:number;
    productId:string;
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