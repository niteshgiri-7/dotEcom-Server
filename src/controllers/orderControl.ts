import { NextFunction, Request, Response } from "express";
import { NewOrderRequestBody } from "../types/orderTypes.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
import { Order } from "../models/order.js";
import { invalidateCache } from "../utils/invalidateCache.js";
import { myCache } from "../app.js";
import { updateStock } from "../utils/updateStock.js";

export const addNewOrder = TryCatch(
  async (
    req: Request<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    //FIXME: check if user exist or not

    const {
      deliveryCharge,
      discount,
      orderedItems,
      shippingInfo,
      status,
      total,
      orderedBy,
    } = req.body;
    if (
      !deliveryCharge ||
      !discount ||
      !orderedItems ||
      !shippingInfo ||
      !total ||
      !orderedBy
    )
      return next(new ErrorHandler("Incomplete data", 400));

    const newOrder = await Order.create(req.body);
    const isSuccess: boolean | undefined = await updateStock(
      orderedItems,
      "decrease"
    );
    if (!isSuccess)
      return next(new ErrorHandler("Product not found to place order", 404));
    await invalidateCache({ product: true, order: true, userId: orderedBy });

    res.status(200).json({
      success: true,
      message: "Order placed successfully!",
      newOrder,
    });
  }
);

export const getMyOrders = TryCatch(async (req, res, next) => {
  const { userId: user } = req.query;
  const ordersKey = `order-${user}`;

  let orders = [];

  if (myCache.has(ordersKey)) {
    orders = JSON.parse(myCache.get(ordersKey) as string);
  }
  //FIXME: check if user exist or not
  else {
    orders = await Order.find({ orderedBy: user });
    if (orders.length === 0)
      return next(new ErrorHandler("You have not placed any orders yet", 404));
    myCache.set(ordersKey, JSON.stringify(orders));
  }
  res.status(200).json({
    success:true,
    orders
  }
  );
});

//for admin to get all the placed orders
export const getAllOrders = TryCatch(async (req, res, next) => {
  //FIXME: check if user exist or not

  let allOrders = [];
  const key = "all-orders";
  if (myCache.has(key)) {
    allOrders = JSON.parse(myCache.get(key) as string);
  } else {
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
//FIXME: only admin can process the order status
export const processOrder = TryCatch(async (req, res, next) => {
  const { userId } = req.params;
  const { orderId } = req.query;
  const order = await Order.findById(orderId);
  if (!order) return next(new ErrorHandler("order not found", 404));

  switch (order.status) {
    case "pending payment":
      order.status = "processing";
      break;
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

  await order.save();

  await invalidateCache({ admin: true, order: true, userId });

  res.status(200).json({
    success: true,
    message: "Order processed successfully",
  });
});


export const cancelOrder = TryCatch(async (req, res, next) => {


});
