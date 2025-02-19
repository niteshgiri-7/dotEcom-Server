import { OrderType, ProductType} from "./modelType.js";

export type NewUserRequestBody = {
  readonly _id?: string;
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
  name:string;
  count:number;
  percentage?:number;
};

export type OverViewCountType ={
  name:string;
  count:number;
  rate:number;
}

export interface ILatestTransactions{
  _id:string;
  status:"pending payment"|"delivered"|"shipped"|"processing";
  discount?:number|null|undefined;
  total:number;
  quantity:number;
}

export type StatsType={
   overviewCount:OverViewCountType[]
  lastSixMnthsStats?:{
    ordersCreated:number[],
    revenueGenerated:number[]
  };
  inventoryStats?:inventStatType[],
  genderRatio:{
    male:number;
    female:number;
  };
  latestTransactions:ILatestTransactions[]
}

declare global {
  namespace Express{
    interface Request{
      stats:StatsType;
      lastSixMnthsOrders:OrderType[];
      allProducts :ProductType[];
    }
  }
}