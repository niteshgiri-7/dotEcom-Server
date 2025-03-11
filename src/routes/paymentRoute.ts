import { Router } from "express";
import { InitiatePayment, VerifyPayment } from "../controllers/paymentControl.js";
import { authenticateUser } from "../middlewares/auth.js";

const paymentRoute = Router();


paymentRoute.use(authenticateUser);

/**
 * @openapi
 * /payment/initiate:
 *   post:
 *     summary: Initiates a payment process
 *     description: Initiates a payment for the order including shipping information, ordered items, and applied coupon code.
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingInfo:
 *                 type: object
 *                 description: Shipping information for the order
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *               orderedItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The product ID
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the ordered product
 *               couponCode:
 *                 type: string
 *                 description: Optional coupon code to apply to the order
 *               total:
 *                 type: number
 *                 description: Total price of the order before any discounts
 *             required:
 *               - shippingInfo
 *               - orderedItems
 *               - total
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentUrl:
 *                   type: string
 *                   description: URL to initiate payment
 *                 pidx:
 *                   type: string
 *                   description: Payment ID
 *                 purchaseId:
 *                   type: string
 *                   description: Unique purchase order ID
 *       400:
 *         description: Bad request, invalid data or missing parameters
 *       500:
 *         description: Server error during payment initiation
 */

/**
 * @openapi
 * /payment/verify:
 *   post:
 *     summary: Verifies the payment status
 *     description: Verifies the payment using the pidx (payment ID) received from the payment gateway.
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pidx:
 *                 type: string
 *                 description: The payment ID to verify
 *             required:
 *               - pidx
 *     responses:
 *       200:
 *         description: Payment verified successfully, order created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the payment verification was successful
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 order:
 *                   type: object
 *                   description: Order details after verification
 *       400:
 *         description: Invalid pidx or failed verification
 *       500:
 *         description: Server error during payment verification
 */

paymentRoute.post("/initiate",InitiatePayment);

paymentRoute.post("/verify",VerifyPayment);


export default paymentRoute;