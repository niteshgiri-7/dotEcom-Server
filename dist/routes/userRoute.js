import express from "express";
import { getAllCustomers, signUp } from "../controllers/userControl.js";
import { singleUpload } from "../middlewares/multer.js";
import { authenticateUser, ensureAdminOnlyAccess } from "../middlewares/auth.js";
const userRouter = express.Router();
//  .../api/v1/user is the base url
userRouter.post("/signUp", singleUpload, signUp);
userRouter.get("/get-all", authenticateUser, ensureAdminOnlyAccess, getAllCustomers);
export default userRouter;
