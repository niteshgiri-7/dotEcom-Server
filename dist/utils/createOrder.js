import { Order } from "../models/order.js";
const createOrder = async (order) => {
    try {
        const createdOrder = await Order.create(order);
        console.log("ordered created by ", createdOrder.orderedBy, `at ${Date.now()}`);
    }
    catch (error) {
        console.log(error);
    }
};
export default createOrder;
