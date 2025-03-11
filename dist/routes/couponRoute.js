import express from "express";
import { checkCouponValidity, CreateNewCoupon, deleteCoupon, getAllCoupons, } from "../controllers/couponControl.js";
import { authenticateUser, ensureAdminOnlyAccess } from "../middlewares/auth.js";
const couponRoute = express.Router();
couponRoute.use(authenticateUser);
/**
 * @openapi
 * /api/v1/coupon/create-new:
 *   post:
 *     summary: Create a new coupon (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "DISCOUNT10"
 *               discountedAmount:
 *                 type: number
 *                 example: 10
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *               maxRedemptionCount:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Coupon created successfully
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
 *                   example: "Coupon created successfully!"
 *                 newCoupon:
 *                   $ref: '#/components/schemas/Coupon'
 *       409:
 *         description: Coupon Code already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coupon Code already exists"
 */
couponRoute.post("/create-new", ensureAdminOnlyAccess, CreateNewCoupon);
/**
 * @openapi
 * /api/v1/coupon/validate/{couponId}:
 *   get:
 *     summary: Check the validity of a coupon
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupon
 *     parameters:
 *       - name: couponId
 *         in: path
 *         required: true
 *         description: ID of the coupon to validate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon is valid and can be used
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
 *                   example: "Coupon is valid and can be used"
 *                 discountAmount:
 *                   type: number
 *                   example: 10
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coupon not found"
 *       400:
 *         description: Coupon validation failed (expired or redeemed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coupon validation failed"
 */
couponRoute.get("/validate/:couponId", checkCouponValidity);
/**
 * @openapi
 * /api/v1/coupon/get-all:
 *   get:
 *     summary: Get all coupons
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupon
 *     responses:
 *       200:
 *         description: Successfully fetched all coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 coupons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 *       404:
 *         description: No coupons created yet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coupons not created yet"
 */
couponRoute.get("/get-all", getAllCoupons);
/**
 * @openapi
 * /api/v1/coupon/delete/{couponId}:
 *   delete:
 *     summary: Delete a coupon (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupon
 *     parameters:
 *       - name: couponId
 *         in: path
 *         required: true
 *         description: ID of the coupon to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
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
 *                   example: "Coupon DISCOUNT10 deleted successfully"
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coupon not found"
 */
couponRoute.delete("/delete/:couponId", ensureAdminOnlyAccess, deleteCoupon);
export default couponRoute;
