import express from "express";
import connectDB from "./utils/db.js";
import { userRouter } from "./routes/userRoute.js";
import errorMiddleWare from "./middlewares/errorMiddleWare.js";

const app = express();

const port = 8080;
connectDB();

app.use(express.json());




app.use("/api/v1/",userRouter)

app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`server up and runnning at port ${port}`);
});



