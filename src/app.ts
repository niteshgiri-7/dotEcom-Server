import express from "express";
import NodeCache from "node-cache";

import connectDB from "./utils/db.js";

import errorMiddleWare from "./middlewares/errorMiddleWare.js";

import productRoute  from "./routes/productRoute.js";
import  userRouter  from "./routes/userRoute.js";

const app = express();
export const myCache = new NodeCache();

const port = 8080;
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}))




app.use("/api/v1/user",userRouter)
app.use("/api/v1/products",productRoute);

app.use("/uploads",express.static("uploads"));
app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`server up and runnning at port ${port}`);
});



