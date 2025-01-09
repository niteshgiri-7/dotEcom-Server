import { OrderType, ProductType, UserType } from "./modelType.js";

export type NewUserRequestBody = {
  readonly _id: string;
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

export type StatsType={
  revenueGrowth:number;
  counts:{
    totalRevenue:number;
    product:number;
    user:number;
    order:number;
  }
  productsChangeRate:number;
  usersGrowthRate:number;
  ordersChangeRate:number;
  lastSixMnthsStats?:{
    ordersCreated:number[],
    revenueGenerated:number[]
  }
}

declare global {
  namespace Express{
    interface Request{
      stats:StatsType;
      lastSixMnthsOrders:OrderType[]
    }
  }
}