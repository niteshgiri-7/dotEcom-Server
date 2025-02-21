import moment from "moment";
import { Order } from "../../models/order.js";
import { Product } from "../../models/product.js";
import { User } from "../../models/user.js";
import { RequestWithStats, StatsType } from "../../types/requestType.js";
import { calculatePercentage } from "../../utils/calculatePercentage.js";
import { TryCatch } from "../../utils/tryCatch.js";

export const findGrowthRate = TryCatch(async (req, res, next) => {
  const typedReq = req as RequestWithStats;
  const today = new Date();

  const thisMonth = {
    start: new Date(today.getFullYear(), today.getMonth(), 1),
    end: today,
  };

  const lastMonth = {
    start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
    end: new Date(today.getFullYear(), today.getMonth(), 0),
  };

  const sixMonthsAgo = moment().subtract(6, "months");

  const getThisMonthProducts = Product.find({
    createdAt: {
      $gte: thisMonth.start,
      $lte: thisMonth.end,
    },
  }).exec();

  const getLastMonthProducts = Product.find({
    createdAt: {
      $gte: lastMonth.start,
      $lte: lastMonth.end,
    },
  }).exec();

  const getThisMonthOrders = Order.find({
    createdAt: {
      $gte: thisMonth.start,
      $lte: thisMonth.end,
    },
  }).exec();

  const getLastMonthOrders = Order.find({
    createdAt: {
      $gte: lastMonth.start,
      $lte: lastMonth.end,
    },
  }).exec();

  const getThisMonthUsers = User.find({
    createdAt: {
      $gte: thisMonth.start,
      $lte: thisMonth.end,
    },
  }).exec();

  const getLastMonthUsers = User.find({
    createdAt: {
      $gte: lastMonth.start,
      $lte: lastMonth.end,
    },
  }).exec();

  // last six months lai herda : kun month maa (kati order create va and kati reveneue generate va) vanera check garnalai
  const getLastSixMonthsOrders = Order.find({
    createdAt: {
      $gte: sixMonthsAgo,
      $lte: moment(),
    },
  });

  const getLatestTransactions = Order.find({})
    .sort({ createdAt: -1 })
    .select(["status", "discount", "orderedItems", "total"])
    .limit(4).lean();

  const [
    thisMonthProducts,
    lastMonthProducts,
    thisMonthOrders,
    lastMonthOrders,
    thisMonthUsers,
    lastMonthUsers,
    productCount,
    userCount, //total number of users in the system
    allOrders, //total of each individual orders to calculate the total revenue generated
    lastSixMnthsOrders,
    allProducts,
    allUsersGender,
    latestTransactions,
  ] = await Promise.all([
    getThisMonthProducts,
    getLastMonthProducts,
    getThisMonthOrders,
    getLastMonthOrders,
    getThisMonthUsers,
    getLastMonthUsers,
    Product.countDocuments(),
    User.countDocuments(),
    Order.find({}).select({ total: 1, status: 1 }),
    getLastSixMonthsOrders,
    Product.find({}),
    User.find({}).select("gender"),
    getLatestTransactions,
  ]);

  // delivered vako orders lai matra linu paryo to check revenue since other orders not delivered yet, might get cancelled
  const thisMonthRevenue = thisMonthOrders
    .filter((order) => order.status === "delivered")
    .reduce((total, order) => (total += order.total), 0);

  const lastMonthRevenue = lastMonthOrders
    .filter((order) => order.status === "delivered")
    .reduce((total, order) => (total += order.total), 0);
  const totalRevenue = allOrders
    .filter((order) => order.status === "delivered")
    .reduce((total, order) => (total += order.total), 0);

  const gender = allUsersGender.reduce(
    (obj, user) => {
      if (user.gender === "male") obj.male++;
      else obj.female++;
      return obj;
    },
    { male: 0, female: 0 }
  );

  const genderRatio = {
    male: Number(((gender.male / userCount) * 100).toFixed(0)),
    female: Number(((gender.female / userCount) * 100).toFixed(0)),
  };
  const modifiedTransaction  = latestTransactions.map((transaction)=>{
    const {orderedItems,_id,...rest} = transaction;
    return {
      ...rest,
      _id:_id.toString(),
      quantity:transaction.orderedItems.length,
      orderedItems:orderedItems
    }
  })

  

  const stats: StatsType = {
    // counts: counts,
    overviewCount:[{
      name:"Product",
      rate:calculatePercentage(
        lastMonthProducts.length,
        thisMonthProducts.length
      ),
      count:productCount,
    },
     {
      name:"User",
      rate:calculatePercentage(
        lastMonthUsers.length,
        thisMonthUsers.length
      ),
      count:userCount
     },
     {
      name:"Orders",
      rate:calculatePercentage(
        lastMonthOrders.length,
        thisMonthOrders.length
      ),
      count:allOrders.length
     },
     {
      name:"Revenue",
      rate:calculatePercentage(lastMonthRevenue, thisMonthRevenue),
      count:totalRevenue
     },
  ],
    genderRatio: genderRatio,
    latestTransactions:modifiedTransaction,
  };
  typedReq.stats = stats;
  typedReq.lastSixMnthsOrders = lastSixMnthsOrders; //to calcuate last 6 mnths stats in next middleware
  typedReq.allProducts = allProducts; //used in getInventory to find percentage occupied by each categories products
  next();
});
