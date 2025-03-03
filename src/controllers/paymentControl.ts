import axios, { AxiosRequestConfig } from "axios";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { Coupon } from "../models/coupon.js";
import { Product } from "../models/product.js";
import { ICoupon } from "../types/couponType.js";
import {
  IPaymentInitiateRequest,
  IPaymentInitiateResponse,
  IPaymentLookupResponse,
} from "../types/paymentType.js";
import {
  IAuthRequest,
  IinitiatePaymentRequestBody,
} from "../types/requestType.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";

import { config } from "dotenv";
import { myCache } from "../app.js";
import createOrder from "../utils/createOrder.js";
import { updateStock } from "../utils/updateStock.js";
config({
  path: "./.env",
});

const KHALTI = process.env.KHALTI_URL!;

const axiosRequestConfig: AxiosRequestConfig = {
  headers: {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
};

export const InitiatePayment = TryCatch(
  async (
    req: Request<object, object, IinitiatePaymentRequestBody>,
    res,
    next
  ) => {
    const { shippingInfo, orderedItems, couponCode, total } = req.body;
    let discount: number = 0,
      totalAmount: number;
    const authReq = req as IAuthRequest;

    if (!shippingInfo || !orderedItems || !total)
      return next(new ErrorHandler("Incomplete Data", 400));

    if (couponCode) {
      const coupon = (await Coupon.findOne({ code: couponCode })) as ICoupon;
      if (!coupon) return next(new ErrorHandler("Invalid coupon Code", 400));

      const isReedemAvailable =
        (coupon?.availableRedemptionCount as number) > 0 &&
        coupon?.expiresAt.getTime() > Date.now();

      if (!isReedemAvailable)
        return next(
          new ErrorHandler(
            "Coupon expired or reached  maximum redeemption",
            400
          )
        );
      discount = coupon.discountedAmount;
      coupon.availableRedemptionCount! -= 1;
      await coupon.save();
    }

    const isOrderedItemsInStock = await Promise.all(
      orderedItems.map(async (item) => {
        const product = await Product.findById(item._id);
        return product;
      })
    );
    if (isOrderedItemsInStock.includes(null))
      return next(new ErrorHandler("Product not found in the system", 400));

    if (discount) totalAmount = total - discount;
    else totalAmount = total;

    const purchaseId = uuidv4();

    myCache.set(purchaseId, JSON.stringify(req.body));

    const paymentData: IPaymentInitiateRequest = {
      return_url: `${process.env.DOMAIN}/payment-callback`,
      website_url: process.env.DOMAIN as string,
      amount: totalAmount * 100,
      customer_info: {
        name: authReq.user?.uid as string,
      },
      purchase_order_id: purchaseId,
      purchase_order_name: "DotEcomPurchase",
    };

    const { data} = await axios.post<IPaymentInitiateResponse>(
      `${KHALTI}/epayment/initiate/`,
      paymentData,
      axiosRequestConfig
    );
    myCache.set(data.pidx,JSON.stringify(req.body));

    return res.json({
      paymentUrl: data.payment_url,
      pidx: data.pidx,
      purchaseId,
    });
  }
);


export const VerifyPayment = TryCatch(
  async (
    req: Request<object, object, { pidx: string}>,
    res,
    next
  ) => {
    const { pidx:initialPidx} = req.body;
    
    if (!initialPidx) return next(new ErrorHandler("pidx required", 400));
      


    const authReq = req as IAuthRequest;

    const response = await axios.post<IPaymentLookupResponse>(
      `${KHALTI}/epayment/lookup/`,
      { pidx:initialPidx },
      axiosRequestConfig
    );
    const { status,pidx:verifiedPidx} =
      response.data;
    if (status === "Failed")
      return next(new ErrorHandler("Payment failed!", 500));

    if (status === "Completed") {
      if (initialPidx!== verifiedPidx) {
        myCache.del(initialPidx);
        return next(new ErrorHandler("Invalid purchase Id", 400));
      }

      if (myCache.has(initialPidx)) {
        const order: IinitiatePaymentRequestBody = JSON.parse(myCache.get((initialPidx))!);
        order.orderedBy = authReq?.user?.uid as string;
        await createOrder(order);
        await updateStock(order.orderedItems, "decrease");
        myCache.del(initialPidx);

        return res.status(200).json({
          success: true,
          message: "Order created Successfully!",
          order,
        });
      }
      else return next(new ErrorHandler("No order found",404));
    } else {
      myCache.del(initialPidx);
      return next(new ErrorHandler("Something went wrong!Please Retry!", 500));
    }
  }
);
