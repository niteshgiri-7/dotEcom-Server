import { TryCatch } from "../utils/tryCatch.js";
import { myCache } from "../app.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { Product } from "../models/product.js";
import { invalidateCache } from "../utils/invalidateCache.js";
import ErrorHandler from "../utils/utility-class.js";
export const addNewProduct = TryCatch(async (req, res, next) => {
    console.log("from controller", req.body);
    const imageReq = req;
    const { category, name, price, stock } = req.body;
    if (!req.file)
        return next(new ErrorHandler("Please Add Photo", 400));
    const productExist = await Product.findOne({ name: name });
    if (productExist)
        await cloudinary.uploader.destroy(imageReq.fileUpload?.publicId);
    const savedProduct = await Product.create({
        category: category.toLowerCase(),
        name,
        photo: {
            secure_url: imageReq.fileUpload?.imageUrl,
            public_id: imageReq.fileUpload?.publicId
        },
        price,
        stock,
    });
    // invalidating the cache as soon as a new product is created
    await invalidateCache({ product: true, admin: true });
    return res.status(200).json({
        success: true,
        message: `Product ${savedProduct.name} is successfully added`,
    });
});
export const getAllProducts = TryCatch(async (req, res, next) => {
    let Products;
    if (myCache.has("all-products")) {
        Products = JSON.parse(myCache.get("all-products"));
    }
    else {
        Products = await Product.find({}).select({
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        });
        if (Products.length === 0)
            return next(new ErrorHandler("No Products Found", 404));
        myCache.set("all-products", JSON.stringify(Products));
    }
    return res.status(200).json({ success: true, Products });
});
export const getProductDetails = TryCatch(async (req, res, next) => {
    const { productId: id } = req.params;
    let productDetails;
    if (myCache.has(`product-${id}`)) {
        productDetails = JSON.parse(myCache.get(`product-${id}`));
    }
    else {
        productDetails = await Product.findById(id);
        if (!productDetails)
            return next(new ErrorHandler("Product not Found", 404));
        myCache.set(`product-${id}`, JSON.stringify(productDetails));
    }
    return res.status(200).json({ success: true, productDetails });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const { productId: id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    await cloudinary.uploader.destroy(product.photo.public_id);
    await invalidateCache({ product: true, admin: true });
    return res.status(200).json({
        success: true,
        message: `product ${product.name} deleted successfully`,
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const updateProductImageReq = req;
    const newPhoto = updateProductImageReq.fileUpload;
    const { productId: id } = req.params;
    const updates = req.body;
    let updatedFields;
    if (Object.keys(updates).length === 0)
        return next(new ErrorHandler("Nothing to update", 400));
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    if (newPhoto) {
        updatedFields = { ...updates, photo: { secure_url: newPhoto.imageUrl, public_id: newPhoto.publicId } };
        await cloudinary.uploader.destroy(product.photo.public_id);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updatedFields }, { new: true, runValidators: true });
    invalidateCache({ product: true, admin: true });
    console.log("sending response");
    return res.status(200).json({
        success: true,
        message: `Product ${product._id} successfully updated`,
        updatedProduct,
    });
});
export const getProductCategories = TryCatch(async (req, res, next) => {
    let categories;
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories"));
    }
    else {
        categories = await Product.distinct("category");
        if (!categories)
            return next(new ErrorHandler("No categories found", 400));
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories,
    });
});
export const getLatestProducts = TryCatch(async (req, res, next) => {
    let latestProducts;
    if (myCache.has("latest-products")) {
        latestProducts = JSON.parse(myCache.get("latest-products"));
    }
    else {
        latestProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        if (!latestProducts)
            return next(new ErrorHandler("Products not found", 404));
        myCache.set("latest-product", JSON.stringify(latestProducts));
    }
    return res.status(200).json({ success: true, latestProducts });
});
export const getProductsByFilter = TryCatch(async (req, res, next) => {
    const { price, search, sort, category } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 5;
    const skip = (page - 1) * limit;
    const BaseQuery = {};
    let productOn_a_Page, totalProductsBasedOnFilter, totalPage, cachedData;
    //Object.keys(req.query) returns array of keys e.g:-['price','search',...]
    //sort() sorts in alphabetical order
    // then reducing that array to return an object with key value pair.
    // using generic to indicate that accumulator will be an object(initially empty {}), ani tyo object ko key value pair duitai string ho
    // then in req.query[key] asserting that tyo key chai searchReqQuery object jun cha teskai key ho
    const queryKey = JSON.stringify(Object.keys(req.query)
        .sort()
        .reduce((acc, key) => {
        acc[key] = req.query[key];
        return acc;
    }, {}));
    if (myCache.has(queryKey)) {
        cachedData = JSON.parse(myCache.get(queryKey));
        ({ productOn_a_Page, totalProductsBasedOnFilter, totalPage } =
            cachedData);
    }
    else {
        if (search) {
            BaseQuery.name = {
                $regex: search,
                $options: "i", //becomes case insensitive
            };
        }
        if (price) {
            BaseQuery.price = {
                $lte: Number(price),
            };
        }
        if (category)
            BaseQuery.category = category;
        [productOn_a_Page, totalProductsBasedOnFilter] = await Promise.all([
            await Product.find(BaseQuery)
                .sort(sort && { price: sort === "asc" ? 1 : -1 })
                .limit(limit)
                .skip(skip),
            await Product.find(BaseQuery),
        ]);
        //if sort is defined then sort it by price.
        // if sort is asc then sort by least price else highest price
        //in first page returns 5 documents, in 2nd pg skips first 5 documents and returns next 5
        // page-1:==>1,2,3,4,5
        //page-2:===>6,7,8,9,10
        //(pagination concept vancha yeslai)
        //totalPage for the filteredProducts
        // let's say for the given baseQuery,total filtered items are 15,then there would be 3 totalPages
        if (productOn_a_Page.length === 0)
            return next(new ErrorHandler("Products not found", 404));
        totalPage = Math.ceil(totalProductsBasedOnFilter.length / limit);
        myCache.set(queryKey, JSON.stringify({
            productOn_a_Page,
            totalProductsBasedOnFilter,
            totalPage,
        }), 60);
    }
    return res.status(200).json({
        success: true,
        totalPage,
        productOn_a_Page,
    });
});
