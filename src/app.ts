import express from "express";
import { userRoute } from "./routes/userRoute.js";
import { connectDB } from "./utils/db.js";

const app = express();
const PORT = 8080;

connectDB();

app.use(express.json());
app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server up and running at port ${PORT}`);
});
