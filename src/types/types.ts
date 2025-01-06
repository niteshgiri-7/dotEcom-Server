import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

//User model type
export interface UserType extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: "male" | "female";
  role: "user" | "admin";
  DOB: Date;
  createdAt: Date;
  updatedAt: Date;

  // this is virtual attribute
  age: number;
}
// Product model type
export interface ProductType extends Document {
  readonly id: number;
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
}

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

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  sort?: string;
  page?: string;
  price?: string;
  search?: string;
  category?:string;
};

export interface BaseQueryType {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}

export type InvalidateCachePropsType = {
  product?:boolean;
  order?:boolean;
  admin?:boolean;
}