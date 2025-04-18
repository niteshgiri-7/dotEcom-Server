import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { invalidateCache } from "../utils/invalidateCache.js";
import { TryCatch } from "../utils/tryCatch.js";
import { updateStock } from "../utils/updateStock.js";
import ErrorHandler from "../utils/utility-class.js";
export const getMyOrders = TryCatch(async (req, res, next) => {
    const { uid: userId } = req.user;
    const ordersKey = `order-${userId}`;
    let orders = [];
    if (myCache.has(ordersKey)) {
        orders = JSON.parse(myCache.get(ordersKey));
    }
    else {
        orders = await Order.find({ orderedBy: userId }).select("-shippingInfo -updatedAt -orderedBy");
        if (orders.length === 0)
            return next(new ErrorHandler("You have not placed any orders yet", 404));
        myCache.set(ordersKey, JSON.stringify(orders));
    }
    res.status(200).json({
        success: true,
        orders,
    });
});
export const getAllOrders = TryCatch(async (req, res, next) => {
    let allOrders = [];
    const key = "all-orders";
    if (myCache.has(key)) {
        allOrders = JSON.parse(myCache.get(key));
    }
    else {
        allOrders = await Order.find({}).populate("orderedBy", "name");
        if (allOrders.length === 0)
            return next(new ErrorHandler("No orders found", 404));
        myCache.set(key, JSON.stringify(allOrders));
    }
    return res.status(200).json({
        success: true,
        allOrders,
    });
});
export const processOrder = TryCatch(async (req, res, next) => {
    const { orderId } = req.params;
    const { uid: id } = req.user;
    const order = await Order.findById(orderId);
    if (!order)
        return next(new ErrorHandler("order not found", 404));
    switch (order.status) {
        case "processing":
            order.status = "shipped";
            break;
        case "shipped":
            order.status = "delivered";
            break;
        default:
            order.status = "delivered";
            break;
    }
    const updatedOrder = await order.save();
    invalidateCache({ admin: true, order: true, userId: id });
    return res.status(200).json({
        success: true,
        message: "Order processed successfully",
        status: updatedOrder.status,
    });
});
export const cancelOrder = TryCatch(async (req, res, next) => {
    const { uid: userId } = req.user;
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order)
        return next(new ErrorHandler("Order not found", 404));
    if (order.orderedBy !== userId)
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    if (order.status === "shipped" || order.status === "delivered")
        return next(new ErrorHandler(`Order already ${order.status}`, 403));
    await order.deleteOne({ orderedBy: userId, _id: orderId });
    const { orderedItems } = order;
    await updateStock(orderedItems, "increase");
    invalidateCache({ order: true, admin: true, userId: userId });
    return res.status(200).json({
        success: true,
        message: "Order successfully canceled",
    });
});
