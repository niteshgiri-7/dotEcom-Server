import express from "express";
import NodeCache from "node-cache";
import { config } from "dotenv";

import connectDB from "./utils/db.js";

import errorMiddleWare from "./middlewares/errorMiddleWare.js";

import productRoute  from "./routes/productRoute.js";
import  userRouter  from "./routes/userRoute.js";
import morgan from "morgan";
import orderRoute from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import statsRoute from "./routes/statsRoute.js";

config({
  path:"./.env"
});

const app = express();
export const myCache = new NodeCache();

const port = process.env.PORT;
const URL:string = process.env.PRODUCTION_DB_URL || process.env.LOCAL_DB_URL as string;
connectDB(URL);

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(morgan("tiny"));



app.use("/api/v1/user",userRouter)
app.use("/api/v1/products",productRoute);
app.use("/api/v1/order",orderRoute)
app.use("/api/v1/payment",paymentRoute);
app.use("/api/v1/stats",statsRoute);

app.use("/uploads",express.static("uploads"));
app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`server up and runnning at port ${port}`);
});



