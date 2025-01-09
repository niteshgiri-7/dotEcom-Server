import express from "express";
import { getDashboardStats } from "../controllers/statsControl.js";
import { fingGrowthRate } from "../middlewares/stats/analytics.js";
import { getLastSixMnthsStats } from "../middlewares/stats/last6mnthsAnalytics.js";
// routes to get the statistics of the admin dashboard

const statsRoute = express.Router();



statsRoute.get("/admin-dashboard",fingGrowthRate,getLastSixMnthsStats,getDashboardStats);


export default statsRoute;