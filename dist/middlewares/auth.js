import admin from "../config/firebase.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
export const authenticateUser = TryCatch(async (req, res, next) => {
    let token = req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null;
    if (!token)
        token = req.cookies["token"];
    if (!token)
        return next(new ErrorHandler("Unauthorized,No token provided", 401));
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
});
export const ensureAdminOnlyAccess = TryCatch(async (req, res, next) => {
    const { role } = req.user;
    if (role !== "admin")
        return next(new ErrorHandler("Admin only Access\n Access Denied", 401));
    next();
});
