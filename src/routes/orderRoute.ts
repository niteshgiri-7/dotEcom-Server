import express from "express";
import { cancelOrder, createNewOrder, getAllOrders, getMyOrders, processOrder } from "../controllers/orderControl.js";
import { authenticateUser } from "../middlewares/auth.js";
// import { isAdmin } from "../middlewares/auth.js";

 const orderRoute = express.Router();
//root route is ==>> /api/v1/order
 //FIXME: tala userId jotma as params gai racha,jwt halera user lai req.user bata ani orders lai orderId req.params bata liney

//  .../api/v1/order is the base url

 orderRoute.use(authenticateUser);

 orderRoute.post("/create-new",createNewOrder);
 
 orderRoute.get("/my-orders",getMyOrders);

 orderRoute.get("/admin/all-orders",getAllOrders);

 orderRoute.patch("/update-status/:orderId",processOrder);

 //route=> /delete/1234?orderId=
 orderRoute.delete("/cancel/:orderId",cancelOrder);//TODO: use req.user object to identify the user

 export default orderRoute;