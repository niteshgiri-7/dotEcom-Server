import moment from "moment";
import { TryCatch } from "../../utils/tryCatch.js";
import { Request } from "express";
import { RequestWithStats } from "../../types/requestType.js";

// to calculate the stats of last months each
// no. of orders created at each months
// total revenue generated at each months
export const getLastSixMnthsStats = TryCatch(
  async (req: Request, res, next) => {
    const typedReq = req as RequestWithStats;
    const { lastSixMnthsOrders } = typedReq;
    const noOfMonths: number = Number(process.env.NO_OF_MONTHS);

    const ordersCreated: number[] = new Array(noOfMonths).fill(0);
    const revenueGenerated: number[] = new Array(noOfMonths).fill(0);

    lastSixMnthsOrders.forEach((order) => {
      const createdAt = order.createdAt;
      const monthDiff = moment().diff(moment(createdAt), "months");
      
      ordersCreated[ordersCreated.length - 1 - monthDiff] += 1;
      revenueGenerated[revenueGenerated.length - 1 - monthDiff] += order.total;
    });

    const lastSixMnthsStats = {
      ordersCreated,
      revenueGenerated,
    };

    typedReq.stats.lastSixMnthsStats = lastSixMnthsStats;
    next();
  }
);
