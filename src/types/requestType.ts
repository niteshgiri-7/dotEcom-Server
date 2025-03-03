import { Request } from "express";
import { OrderType, ProductType, ShippingInfoType } from "./modelType.js";
import { DecodedIdToken } from "firebase-admin/auth";
import { OrderItemsType } from "./orderTypes.js";

export type NewUserRequestBody = {
  uid:string;
  name: string;
  email: string;
  photo: string;
  gender: "male" | "female";
  role: "user" | "admin";
  DOB: Date;
};

export type NewPoductRequestBody = {
  readonly _id: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
};

export type inventStatType = {
  name: string;
  count: number;
  percentage?: number;
};

export type OverViewCountType = {
  name: string;
  count: number;
  rate: number;
};

export interface ILatestTransactions {
  _id: string;
  status?: "pending payment" | "delivered" | "shipped" | "processing";
  discount?: number | null | undefined;
  total: number;
  quantity: number;
}

export type StatsType = {
  overviewCount: OverViewCountType[];
  lastSixMnthsStats?: {
    ordersCreated: number[];
    revenueGenerated: number[];
  };
  inventoryStats?: inventStatType[];
  genderRatio: {
    male: number;
    female: number;
  };
  latestTransactions: ILatestTransactions[];
};

export interface RequestWithStats extends Request{
  stats:StatsType;
  lastSixMnthsOrders:OrderType[];
  allProducts:ProductType[];

}

export interface ICustomDecodedIdToken extends DecodedIdToken{
  role:string;
}
export interface IAuthRequest extends Request{
  user?:ICustomDecodedIdToken;
}

export interface IUploadImageRequest extends Request{
  fileUpload?:{
    imageUrl:string;
    publicId:string;
  }
}



export interface IinitiatePaymentRequestBody {
  shippingInfo:ShippingInfoType;
  orderedItems:OrderItemsType[]
  couponCode?:string;
  orderedBy?:string;
  total:number;
}