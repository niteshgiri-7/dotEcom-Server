import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../utils/tryCatch.js";
import { NewPoductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const addNewProduct = TryCatch(
  async (
    req: Request<{}, {}, NewPoductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("from controller", req.body);
    const { _id, category, name, price, stock } = req.body;

    if (!_id) return next(new ErrorHandler("invalid Id", 400));

    if (!req.file) return next(new ErrorHandler("Please Add Photo", 400));
    const productExist = await Product.findById(_id);
    if (productExist) {
      rm(req.file.path, () =>
        console.log("duplicate file removed since already exists")
      );
      return next(new ErrorHandler("product already Exists", 400));
    }
    if (!name || !category || !price || !stock) {
      rm(req.file.path, () => {
        console.log(req.file?.path, "deleted");
      });
      return next(new Error("Incomplete Data"));
    }

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

export const getAllProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const Products = await Product.find({}).select({
      createdAt: 0,
      updatedAt: 0,
    });
    console.log(Products);
    if (Products.length === 0)
      return next(new ErrorHandler("No Products Found", 404));
    res.status(200).json({ success: true, Products });
  }
);

export const getProductDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    const productDetails = await Product.findById(id);
    if (!productDetails)
      return next(new ErrorHandler("Product not Found", 404));
    return res.status(200).json({ success: true, productDetails });
  }
);

export const deleteProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.query;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) return next(new ErrorHandler("Product not found", 404));

    rm(product.photo, () => {
      console.log("photo deleted");
    });

    return res.status(200).json({
      success: true,
      message: `product ${product.name} deleted successfully`,
    });
  }
);

export const updateProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.query;
    const updates = req.body;
    const photoPath = req.file?.path;
    let updatedFields;
    
   if(Object.keys(updates).length===0) return next(new ErrorHandler("Nothing to update",400));

    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    if (photoPath) {
      updatedFields = { ...updates, photo: photoPath };
      rm(product?.photo, () => {
        console.log("Old photo deleted");
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedFields },
      { runValidators: true }
    );

    res.status(200).json({
      success:true,
      message:`Product ${product._id} successfully updated`,
      updateProduct
    })
  }
);

export const getProductCategories = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Product.distinct("category");
    res.status(200).json({
      success: true,
      categories,
    });
  }
);

export const getLatestProducts = TryCatch(async (req, res, next) => {
  const latestProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(5);
  console.log(latestProducts);
  if (!latestProducts) return next(new ErrorHandler("Products not found", 404));

  return res.status(200).json({ success: true, latestProducts });
});

export const getProductsByFilter = TryCatch(async (req, res, next) => {
  res.send("hello");
});
