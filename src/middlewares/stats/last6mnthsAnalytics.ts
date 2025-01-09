import moment from "moment";
import { TryCatch } from "../../utils/tryCatch.js";
import { Request } from "express";

// to calculate the stats of last months each
// no. of orders created at each months
// total revenue generated at each months
export const getLastSixMnthsStats = TryCatch(async (req:Request, res, next) => {
  const { lastSixMnthsOrders } = req;
  const noOfMonths: number = Number(process.env.NO_OF_MONTHS);
  const ordersCreated: number[] = new Array(noOfMonths).fill(0);
  const revenueGenerated: number[] = new Array(noOfMonths).fill(0);
  lastSixMnthsOrders.forEach((order) => {
    console.log("hello")
    const createdAt = order.createdAt;
    const monthDiff = moment().diff(moment(createdAt), "months");
   console.log("month diff",monthDiff)
    ordersCreated[ordersCreated.length - 1 - monthDiff] += 1;
    revenueGenerated[revenueGenerated.length - 1 - monthDiff] += order.total;
  });

  const lastSixMnthsStats={
    ordersCreated,
    revenueGenerated
  }

  req.stats.lastSixMnthsStats=lastSixMnthsStats;
next();
   
});
