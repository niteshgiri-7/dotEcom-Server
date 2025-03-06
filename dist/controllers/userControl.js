import admin from "../config/firebase.js";
import { User } from "../models/user.js";
import { invalidateCache } from "../utils/invalidateCache.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
export const signUp = TryCatch(async (req, res, next) => {
    const newUserImageReq = req;
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer")
        ? authHeader.split(" ")[1]
        : null;
    if (!token)
        return next(new ErrorHandler("No token provided in Authorization Header", 400));
    await admin.auth().verifyIdToken(token);
    const { uid, name, email, gender, DOB, role: roleOfNewPersonInReqBody, } = req.body;
    const isAdminThereInSystem = await User.exists({ role: "admin" });
    if (isAdminThereInSystem && roleOfNewPersonInReqBody === "admin")
        throw new ErrorHandler("can't signup, admin already exists", 401);
    const user = await User.create({
        _id: uid,
        name,
        email,
        gender,
        DOB,
        role: roleOfNewPersonInReqBody,
        photo: {
            secure_url: newUserImageReq.fileUpload?.imageUrl,
            public_id: newUserImageReq.fileUpload?.publicId,
        },
    });
    await admin
        .auth()
        .setCustomUserClaims(uid, { role: roleOfNewPersonInReqBody });
    invalidateCache({ admin: true });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1 * 60 * 60 * 1000,
    });
    return res.status(201).json({
        success: true,
        message: `Welcome ${req.body.name}`,
        user,
    });
});
export const login = TryCatch(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer")
        ? authHeader.split(" ")[1]
        : null;
    if (!token)
        return next(new ErrorHandler("No auth token provided,Login Failed!", 400));
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;
    const user = await User.findOne({ _id: uid });
    if (!user)
        return next(new ErrorHandler("User not found. Please signUp first.", 404));
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1 * 60 * 60 * 1000,
    });
    return res.status(200).json({
        success: true,
        message: "Logged in Successfully",
        user,
    });
});
export const logOut = TryCatch(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 0
    });
    return res.status(200).json({ message: "Logged Out Successfully!" });
});
export const getAllCustomers = TryCatch(async (req, res, next) => {
    const allCustomers = await User.find({});
    if (!allCustomers)
        return next(new ErrorHandler("No customers Found", 404));
    res.status(200).json({
        success: true,
        allCustomers,
    });
});
