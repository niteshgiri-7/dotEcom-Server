import express from "express";
import NodeCache from "node-cache";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import connectDB from "./utils/db.js";
import errorMiddleWare from "./middlewares/errorMiddleWare.js";
import productRoute from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";
import statsRoute from "./routes/statsRoute.js";
import couponRoute from "./routes/couponRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
config({
    path: "./.env"
});
const app = express();
export const myCache = new NodeCache();
const port = process.env.PORT || 8080;
const URL = process.env.PRODUCTION_DB_URL || process.env.LOCAL_DB_URL;
connectDB(URL);
const corsOption = {
    origin: process.env.DOMAIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/stats", statsRoute);
app.use("/api/v1/payment", paymentRoute);
app.use(errorMiddleWare);
app.listen(port, () => {
    console.log(`server up and runnning at port ${port}`);
});
export default app;
