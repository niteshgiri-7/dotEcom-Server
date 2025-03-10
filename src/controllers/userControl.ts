import { CookieOptions, NextFunction, Request, Response } from "express";
import admin from "../config/firebase.js";
import { User } from "../models/user.js";
import {
  IAuthRequest,
  ICustomDecodedIdToken,
  IUploadImageRequest,
  NewUserRequestBody,
} from "../types/requestType.js";
import { invalidateCache } from "../utils/invalidateCache.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
import { DecodedIdToken } from "firebase-admin/auth";

export const signUp = TryCatch(
  async (
    req: Request<object, object, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const newUserImageReq = req as IUploadImageRequest;

    const authHeader = req.headers["authorization"];

    const token = authHeader?.startsWith("Bearer")
      ? authHeader.split(" ")[1]
      : null;

    if (!token)
      return next(
        new ErrorHandler("No token provided in Authorization Header", 400)
      );

    await admin.auth().verifyIdToken(token);

    const {
      uid,
      name,
      email,
      gender,
      DOB,
      role: roleOfNewPersonInReqBody,
    } = req.body;

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
      .setCustomUserClaims(uid as string, { role: roleOfNewPersonInReqBody });

    invalidateCache({ admin: true });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome ${req.body.name}`,
      user,
    });
  }
);

export const login = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const { rememberMe }: { rememberMe: boolean } = req.body;
    console.log("rememberMe", rememberMe);
    const token = authHeader?.startsWith("Bearer")
      ? authHeader.split(" ")[1]
      : null;

    if (!token)
      return next(
        new ErrorHandler("No auth token provided,Login Failed!", 400)
      );

    const decodedToken = await admin.auth().verifyIdToken(token);

    const { uid } = decodedToken;

    const user = await User.findOne({ _id: uid });

    if (!user)
      return next(
        new ErrorHandler("User not found. Please signUp first.", 404)
      );

    const cookieOption: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    if (rememberMe) cookieOption.maxAge = 7 * 24 * 60 * 60 * 10000;

    res.cookie("token", token, cookieOption);

    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user,
    });
  }
);

export const logOut = TryCatch(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logged Out Successfully!" });
});

export const refreshToken = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers["authorization"];
    const rememberMe: boolean = req.body["rememberMe"];
    console.log("rememberMe", rememberMe);
    const token = authHeader?.startsWith("Bearer")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) return next(new ErrorHandler("No auth token provided", 400));

    const { uid } = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ _id: uid });

    if (!user) return next(new ErrorHandler("No user found", 404));

    const cookieOption: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    if (rememberMe) cookieOption.maxAge = 7 * 24 * 60 * 60 * 10000;

    res.cookie("token", token, cookieOption);
    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  }
);

export const checkAuth = TryCatch(async (req: IAuthRequest, res, next) => {
  const token = req.cookies["token"];

  if (!token)
    return next(new ErrorHandler("No token provided,unauthorized!", 401));

  const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(token);

  const {role} = decodedToken as ICustomDecodedIdToken;


  return res.status(200).json({
    success: true,
    message: "User Verified",
    isAuthenticated:true,
    role,
  });
});

export const getAllCustomers = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const allCustomers = await User.find({});
    if (!allCustomers) return next(new ErrorHandler("No customers Found", 404));

    res.status(200).json({
      success: true,
      allCustomers,
    });
  }
);
