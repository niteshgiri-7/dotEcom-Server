import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/user.js";
import { invalidateCache } from "../utils/invalidateCache.js";
export const signUp = TryCatch(async (req, res) => {
    const { name, email, gender, DOB, role } = req.body;
    await User.create({
        name,
        email,
        gender,
        DOB,
        role,
        photo: req.file?.path
    });
    invalidateCache({ admin: true });
    res.status(201).json({
        success: true,
        message: `Welcome ${req.body.name}`,
    });
});
export const getAllCustomers = TryCatch(async (req, res, next) => {
    const allCustomers = await User.find({});
    if (!allCustomers)
        return next(new ErrorHandler("No customers Found", 404));
    res.status(200).json({
        success: true,
        allCustomers
    });
});
