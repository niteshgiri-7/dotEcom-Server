import { AxiosError } from "axios";
import { FirebaseAuthError } from "firebase-admin/auth";
import mongoose from "mongoose";
const errorMiddleWare = (error, req, res, next) => {
    error.message || (error.message = "Something went wrong");
    error.statusCode || (error.statusCode = 500);
    if (error.name === "CastError") {
        error.message = "Invalid ID";
        error.statusCode = 400;
    }
    if (error instanceof mongoose.Error.ValidationError) {
        error.message = Object.values(error.errors).map((err) => err.message).join(", ");
        error.statusCode = 400;
    }
    if (error instanceof AxiosError) {
        error.message = error.response?.data;
    }
    if (error.name === "MongoServerError") {
        error.message = "Email Already Exists!";
    }
    let action = false;
    if (error instanceof FirebaseAuthError && error.code === "auth/id-token-expired") {
        error.statusCode = 401;
        error.message = "FireBase Token as expired";
        action = true;
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(action && { action: "refresh" }),
    });
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    next(error);
};
export default errorMiddleWare;
