import express from "express";
import { addNewOrder, cancelOrder, getAllOrders, getMyOrders, processOrder } from "../controllers/orderControl.js";
import { isAdmin } from "../middlewares/auth.js";

 const orderRoute = express.Router();
//root route is ==>> /api/v1/order
 //FIXME: tala userId jotma as params gai racha,jwt halera user lai req.user bata ani orders lai orderId req.params bata liney
 orderRoute.post("/create-new",addNewOrder);

// req query is ?userId=
 orderRoute.get("/my-orders",getMyOrders);//TODO: use req.user object to identify the user

 orderRoute.get("/admin/all-orders/:userId",isAdmin,getAllOrders);//TODO: use req.user object to identify the user

//to change the status of the order , route=>process/1234?orderId=
 orderRoute.patch("/update-status/:userId",isAdmin,processOrder);//TODO: use req.user object to identify the user

 //route=> /delete/1234?orderId=
 orderRoute.delete("/delete/:userId?",cancelOrder);//TODO: use req.user object to identify the user

 export default orderRoute;