import express from "express";

import {
  addNewProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  getProductsByFilter,
  getProductCategories,
  getLatestProducts,
} from "../controllers/productControl.js";


import { authenticateUser, ensureAdminOnlyAccess } from "../middlewares/auth.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import { uploadImageViaMulter } from "../middlewares/multerUploadMiddleware.js";

const productRoute = express.Router(); //product's route is -> /api/v1/products/...


// .../api/v1/products is the base url

/**
 * @openapi
 * /api/v1/products/all:
 *   get:
 *     summary: Get all products
 *     description: Retrieves all products from the database. Uses caching for better performance.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully retrieved all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully retreived all products"
 *                 Products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "65f23ad4e4b0c8a1e6b4f9d1"
 *                       name:
 *                         type: string
 *                         example: "Product Name"
 *                       photo:
 *                         type: object
 *                         properties:
 *                           secure_url:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           public_id:
 *                             type: string
 *                             example: "product-image-12345"
 *                       price:
 *                         type: number
 *                         example: 99.99
 *                       stock:
 *                         type: number
 *                         example: 50
 *                       category:
 *                         type: string
 *                         example: "Electronics"
 *       404:
 *         description: No products found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No Products Found"
 */


productRoute.get("/all", getAllProducts);

productRoute.use(authenticateUser);


/**
 * @openapi
 * /api/v1/products/latest:
 *   get:
 *     summary: Get latest products
 *     description: Retrieves the 5 most recently added products from the database. Requires authentication.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 latestProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "65f23ad4e4b0c8a1e6b4f9d1"
 *                       name:
 *                         type: string
 *                         example: "Latest Product"
 *                       photo:
 *                         type: object
 *                         properties:
 *                           secure_url:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           public_id:
 *                             type: string
 *                             example: "latest-product-image"
 *                       price:
 *                         type: number
 *                         example: 129.99
 *                       stock:
 *                         type: number
 *                         example: 25
 *                       category:
 *                         type: string
 *                         example: "Mobile"
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized, No token provided"
 *       404:
 *         description: No products found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Products not found"
 */

productRoute.get("/latest", getLatestProducts);



/**
 * @openapi
 * /api/v1/products/categories:
 *   get:
 *     summary: Get all product categories
 *     description: Retrieves a list of unique product categories. Requires authentication.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Electronics", "Clothing", "Books"]
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized, No token provided"
 *       400:
 *         description: No categories found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No categories found"
 */

productRoute.get("/categories", getProductCategories);

// .../api/v1/products/filter/?search=...&price=...&category=...&sort=...&page=...
/**
 * @openapi
 * /api/v1/products/filter:
 *   get:
 *     summary: Filter products based on search, price, category, sorting, and pagination
 *     description: Retrieves a list of products that match the provided filters. Requires authentication.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name (case-insensitive)
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Maximum price limit for products
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort products by price in ascending (`asc`) or descending (`desc`) order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Pagination page number
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalPage:
 *                   type: integer
 *                   example: 3
 *                 productOn_a_Page:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "65ff9f2b5a7f2b0012c3e456"
 *                       name:
 *                         type: string
 *                         example: "Wireless Mouse"
 *                       photo:
 *                         type: object
 *                         properties:
 *                           secure_url:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           public_id:
 *                             type: string
 *                             example: "product-123"
 *                       price:
 *                         type: number
 *                         example: 29.99
 *                       stock:
 *                         type: number
 *                         example: 50
 *                       category:
 *                         type: string
 *                         example: "Electronics"
 *       404:
 *         description: No products found based on the given filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Products not found"
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized, No token provided"
 */
productRoute.get("/filter", getProductsByFilter);




/**
 * @swagger
 * /product/add-new:
 *   post:
 *     summary: Add a new product to the inventory
 *     description: This route allows the admin to add a new product with an image, category, price, and stock details. The image is uploaded to Cloudinary.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category of the product (e.g., electronics, clothing).
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product.
 *               stock:
 *                 type: integer
 *                 description: The available stock of the product.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The product image to be uploaded.
 *     responses:
 *       200:
 *         description: Product successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product {product name} is successfully added"
 *       400:
 *         description: Invalid request or missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please Add Photo"
 *       401:
 *         description: Admin-only access denied.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Admin only Access\n Access Denied"
 *       500:
 *         description: Server error or failure while uploading to Cloudinary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No file uploaded"
 */

productRoute.post("/add-new",ensureAdminOnlyAccess, uploadImageViaMulter,uploadToCloudinary, addNewProduct);

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: Get product details
 *     description: Retrieve the details of a product by its ID. Caching is used to improve performance.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 productDetails:
 *                   type: object
 *                   description: The product details.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product not Found"
 *   delete:
 *     summary: Delete a product
 *     description: Admin can delete a product by its ID. The image is also removed from Cloudinary.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product {product name} deleted successfully"
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *   put:
 *     summary: Update a product
 *     description: Admin can update the details of a product by its ID, including changing its image.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category of the product.
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product.
 *               stock:
 *                 type: integer
 *                 description: The stock of the product.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The product image to upload (optional).
 *     responses:
 *       200:
 *         description: Product successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product {productId} successfully updated"
 *                 updatedProduct:
 *                   type: object
 *                   description: The updated product details.
 *       400:
 *         description: Invalid request, nothing to update, or missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Nothing to update"
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 */

productRoute
  .route("/:productId")
  .get(getProductDetails)
  .delete(ensureAdminOnlyAccess, deleteProduct)
  .put(ensureAdminOnlyAccess,uploadImageViaMulter,uploadToCloudinary, updateProduct);

export default productRoute;
