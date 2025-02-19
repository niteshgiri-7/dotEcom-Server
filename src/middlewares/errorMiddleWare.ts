import { Request, NextFunction, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import mongoose from "mongoose";

const errorMiddleWare = (error: ErrorHandler, req: Request, res: Response, next: NextFunction): void => {
    error.message ||= "Something went wrong";
    error.statusCode ||= 500;

    if (error.name === "CastError") {
        error.message = "Invalid ID";
        error.statusCode = 400;
    }

    if (error instanceof mongoose.Error.ValidationError) {
        error.message = Object.values(error.errors).map((err) => err.message).join(", ");
        error.statusCode = 400;
    }


    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });

    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack Trace:\n", error.stack);
};

export default errorMiddleWare;
