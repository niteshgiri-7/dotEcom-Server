import express from "express";
import { getDashboardStats, getPieChartStats } from "../controllers/statsControl.js";
import { findGrowthRate } from "../middlewares/stats/analytics.js";
import { getLastSixMnthsStats } from "../middlewares/stats/last6mnthsAnalytics.js";
import { getInventoryStats } from "../middlewares/stats/getInventory.js";
import { cachedStats } from "../middlewares/stats/cachedStats.js";
import { authenticateUser, ensureAdminOnlyAccess } from "../middlewares/auth.js";
// routes to get the statistics of the admin dashboard
const statsRoute = express.Router();
statsRoute.use(authenticateUser, ensureAdminOnlyAccess);
/**
 * @openapi
 * /api/v1/stats/admin-dashboard:
 *   get:
 *     summary: Get stats for the admin dashboard (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Successfully fetched the admin dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin dashboard stats fetched successfully"
 *                 stats:
 *                   type: object
 *                   properties:
 *                     overviewCount:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Total Orders"
 *                           count:
 *                             type: number
 *                             example: 150
 *                           rate:
 *                             type: number
 *                             example: 5.2
 *                     lastSixMnthsStats:
 *                       type: object
 *                       properties:
 *                         ordersCreated:
 *                           type: array
 *                           items:
 *                             type: number
 *                             example: 100
 *                           minItems: 6
 *                           maxItems: 6
 *                         revenueGenerated:
 *                           type: array
 *                           items:
 *                             type: number
 *                             example: 1200
 *                           minItems: 6
 *                           maxItems: 6
 *                     inventoryStats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Product A"
 *                           count:
 *                             type: number
 *                             example: 30
 *                           percentage:
 *                             type: number
 *                             example: 10
 *                     genderRatio:
 *                       type: object
 *                       properties:
 *                         male:
 *                           type: number
 *                           example: 60
 *                         female:
 *                           type: number
 *                           example: 40
 *                     latestTransactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "orderId12345"
 *                           status:
 *                             type: string
 *                             example: "shipped"
 *                           discount:
 *                             type: number
 *                             example: 10
 *                           total:
 *                             type: number
 *                             example: 100
 *                           quantity:
 *                             type: number
 *                             example: 2
 *       401:
 *         description: Unauthorized - Invalid Firebase token or admin permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin only Access. Access Denied"
 */
statsRoute.get("/admin-dashboard", cachedStats, findGrowthRate, getLastSixMnthsStats, getInventoryStats, getDashboardStats);
/**
 * @openapi
 * /api/v1/stats/pie-chart:
 *   get:
 *     summary: Get pie chart statistics (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Successfully fetched the pie chart stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 chart:
 *                   type: object
 *                   properties:
 *                     pendingPayment:
 *                       type: number
 *                       example: 10
 *                     processing:
 *                       type: number
 *                       example: 15
 *                     shipped:
 *                       type: number
 *                       example: 30
 *                     delivered:
 *                       type: number
 *                       example: 45
 *                     usersAgeGroup:
 *                       type: object
 *                       properties:
 *                         teen:
 *                           type: number
 *                           example: 5
 *                         adult:
 *                           type: number
 *                           example: 10
 *                         old:
 *                           type: number
 *                           example: 3
 *       401:
 *         description: Unauthorized - Invalid Firebase token or admin permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin only Access. Access Denied"
 */
statsRoute.get("/pie-chart", getPieChartStats);
export default statsRoute;
