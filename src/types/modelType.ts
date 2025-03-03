import { Document } from "mongoose";

export interface UserType extends Document {
  _id: string;
  name: string;
  email: string;
  photo: {
    secure_url:string;
    public_id:string;
  }
  gender: "male" | "female";
  role: "user" | "admin";
  DOB: Date;
  createdAt: Date;
  updatedAt: Date;

  // this is virtual attribute
  age: number;
}
export interface ProductType extends Document {
  readonly _id: number;
  name: string;
  photo: {
    secure_url:string;
    public_id:string
  };
  price: number;
  stock: number;
  category: string;
}
export type OrderedItemsType = {
  name: string;
  photo: string;
  quantity: number;
  price: number;
  _id: string;
};
export type ShippingInfoType = {
  state: string;
  city: string;
  pinCode: number;
  country: string;
};
export interface OrderType extends Document {
  shippingInfo: ShippingInfoType;
  status?: "pending payment" | "processing" | "shipped" | "delivered";
  orderedBy: string;
  discount?: number | null;
  total: number;
  orderedItems: OrderedItemsType[];
  createdAt: Date;
}

export type CombinedCachedDataType = {
  productOn_a_Page: ProductType[];
  totalProductsBasedOnFilter: ProductType[];
  totalPage: number;
};
