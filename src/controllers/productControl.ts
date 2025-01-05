import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../utils/tryCatch.js";
import { NewPoductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";

export const addNewProduct = TryCatch(
  async (
    req: Request<{}, {}, NewPoductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("from controller",req.body);
    const { _id, category, name, price, stock } = req.body;

    if (!_id) return next(new ErrorHandler("invalid Id", 400));

    if (!req.file) return next(new ErrorHandler("Please Add Photo", 400));

    if (!name || !category || !price  || !stock)
    return next(new Error("Incomplete Data"));

    const savedProduct = await Product.create({
      _id: _id,
      category: category.toLowerCase(),
      name,
      photo: req.file.path,
      price,
      stock,
    });

    return res.status(200).json({
      success: true,
      message: `Product ${savedProduct.name} is successfully added`,
    });
  }
);
