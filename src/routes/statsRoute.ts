import express from "express";
import { getDashboardStats, getPieChartStats } from "../controllers/statsControl.js";
import { findGrowthRate } from "../middlewares/stats/analytics.js";
import { getLastSixMnthsStats } from "../middlewares/stats/last6mnthsAnalytics.js";
import { getInventoryStats } from "../middlewares/stats/getInventory.js";
import { cachedStats } from "../middlewares/stats/cachedStats.js";
// routes to get the statistics of the admin dashboard

const statsRoute = express.Router();



statsRoute.get("/admin-dashboard",cachedStats,findGrowthRate,getLastSixMnthsStats,getInventoryStats,getDashboardStats);

statsRoute.get("/pie-chart",getPieChartStats);


export default statsRoute;