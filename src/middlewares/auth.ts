import { DecodedIdToken } from "firebase-admin/auth";
import admin from "../config/firebase.js";
import { IAuthRequest, ICustomDecodedIdToken } from "../types/requestType.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";

export const authenticateUser = TryCatch(async (req: IAuthRequest, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer"))
    return next(new ErrorHandler("Unauthorized", 401));

  const token = authHeader.split(" ")[1];

  const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(token);

  req.user = decodedToken as ICustomDecodedIdToken;
  next();
});

export const ensureAdminOnlyAccess = TryCatch(async (req: IAuthRequest, res, next) => {
   
  const { role } = req.user!;
  if (role !== "admin")
    return next(new ErrorHandler("Admin only Access\n Access Denied", 401));

  next();
});
