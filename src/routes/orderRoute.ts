import express from "express";
import { cancelOrder, getAllOrders, getMyOrders, processOrder } from "../controllers/orderControl.js";
import { authenticateUser } from "../middlewares/auth.js";

const orderRoute = express.Router();


orderRoute.use(authenticateUser);

/**
 * @openapi
 * /api/v1/order/my-orders:
 *   get:
 *     summary: Get orders of the user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: List of orders for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - No valid token or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: No orders found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You have not placed any orders yet"
 */

orderRoute.get("/my-orders", getMyOrders);

/**
 * @openapi
 *  /api/v1/order/admin/all-orders:
 *   get:
 *     summary: Get all orders in the database(admin only access)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 allOrders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Invalid Firebase token or admin permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: No orders found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No orders found"
 */

orderRoute.get("/admin/all-orders", getAllOrders);

/**
 * @openapi
 * /api/v1/order/update-status/{orderId}:
 *   patch:
 *     summary: Update the status of an order (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID of the order to be processed
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
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
 *                   example: "Order processed successfully"
 *                 status:
 *                   type: string
 *                   example: "Shipped"
 *       401:
 *         description: Unauthorized - Invalid Firebase token or admin permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin only Access. Access Denied"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 */
orderRoute.patch("/update-status/:orderId", processOrder);

/**
 * @swagger
 * /api/v1/order/cancel/{orderId}:
 *   delete:
 *     summary: Cancel an order
 *     description: This route allows the authenticated user to cancel their order.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID of the order to be canceled
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully canceled the order
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Order already shipped or delivered, cannot be canceled
 */
orderRoute.delete("/cancel/:orderId", cancelOrder);

export default orderRoute;
