import moment from "moment";
import { Order } from "../../models/order.js";
import { Product } from "../../models/product.js";
import { User } from "../../models/user.js";
import { StatsType } from "../../types/requestType.js";
import { calculatePercentage } from "../../utils/calculatePercentage.js";
import { TryCatch } from "../../utils/tryCatch.js";

export const fingGrowthRate = TryCatch(async (req, res, next) => {
  const today = new Date();

  const thisMonth = {
    start: new Date(today.getFullYear(), today.getMonth(), 1),
    end: today,
  };

  const lastMonth = {
    start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
    end: new Date(today.getFullYear(), today.getMonth(), 0),
  };
 
  const sixMonthsAgo = moment().subtract(6,"months");

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
    createdAt:{
      $gte:sixMonthsAgo,
      $lte:moment()
    }
  })
   
  

  const [
    thisMonthProducts,
    lastMonthProducts,
    thisMonthOrders,
    lastMonthOrders,
    thisMonthUsers,
    lastMonthUsers,
    productCount,
    userCount,//total number of users in the system
    allOrders,//total of each individual orders to calculate the total revenue generated
    lastSixMnthsOrders,
    allProducts
  ] = await Promise.all([
    getThisMonthProducts,
    getLastMonthProducts,
    getThisMonthOrders,
    getLastMonthOrders,
    getThisMonthUsers,
    getLastMonthUsers,
    Product.countDocuments(),
    User.countDocuments(),
    Order.find({}).select({total:1,status:1}),
    getLastSixMonthsOrders,
    Product.find({})
  ]);

   // delivered vako orders lai matra linu paryo to check revenue since other orders not delivered yet might get cancelled
  const thisMonthRevenue = thisMonthOrders
    .filter((order) => order.status === "delivered")
    .reduce((total, order) => (total += order.total), 0);

  const lastMonthRevenue = lastMonthOrders
    .filter((order) => order.status === "delivered")
    .reduce((total, order) => (total += order.total), 0);
    const totalRevenue = allOrders
    .filter((order) => order.status === "delivered")
    .reduce((total, order) => (total += order.total), 0);

    const counts = {
        user:userCount,
        product:productCount,
        order:allOrders.length,
        totalRevenue:totalRevenue,
    }
 

  const stats: StatsType = {
    counts:counts,
    revenueGrowth: calculatePercentage(lastMonthRevenue, thisMonthRevenue),
    
    productsChangeRate: calculatePercentage(
      lastMonthProducts.length,
      thisMonthProducts.length
    ),

    usersGrowthRate: calculatePercentage(
      lastMonthUsers.length,
      thisMonthUsers.length
    ),

    ordersChangeRate: calculatePercentage(
      lastMonthOrders.length,
      thisMonthOrders.length
    ),
  };

  req.stats = stats;
  req.lastSixMnthsOrders=lastSixMnthsOrders;//to calcuate last 6 mnths stats in next middleware
  req.allProducts=allProducts;//used in getInventory to find percentage occupied by each categories products
  next();
});
