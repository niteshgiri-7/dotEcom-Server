import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import { TryCatch } from "../utils/tryCatch.js";
import ErrorHandler from "../utils/utility-class.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    const typedReq = req;
    const stats = typedReq.stats;
    if (!stats)
        return next(new ErrorHandler("No Stats Found", 404));
    myCache.set("admin-stats", JSON.stringify(stats));
    res.status(200).json({
        success: true,
        stats,
    });
});
export const getPieChartStats = TryCatch(async (req, res) => {
    let chart;
    const key = "chart-stats";
    if (myCache.has(key)) {
        chart = JSON.parse(myCache.get(key));
    }
    else {
        const [pendingPayment, processing, shipped, delivered, users] = await Promise.all([
            Order.countDocuments({ status: "pending payment" }),
            Order.countDocuments({ status: "processing" }),
            Order.countDocuments({ status: "shipped" }),
            Order.countDocuments({ status: "delivered" }),
            User.find({}).select("DOB"),
        ]);
        const usersAgeGroup = {
            teen: users.filter((user) => user.age < 20).length,
            adult: users.filter((user) => user.age > 19 || user.age < 50).length,
            old: users.filter((user) => user.age > 49).length,
        };
        chart = {
            pendingPayment,
            processing,
            shipped,
            delivered,
            usersAgeGroup,
        };
        myCache.set(key, JSON.stringify(chart));
    }
    return res.status(200).json({
        success: true,
        chart,
    });
});
