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
    if (error.name === "MongoServerError") {
        error.message = "Email Already Exists!";
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
    console.log("error while hiting route", req.originalUrl);
    console.log("error code", error);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    next(error);
};
export default errorMiddleWare;
