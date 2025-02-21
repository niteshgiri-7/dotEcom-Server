import mongoose, { Error } from "mongoose";
const connectDB = async (URL) => {
    try {
        await mongoose.connect(URL, {
            dbName: "Ecommerce_TS"
        });
        console.log("Connected to Database successfully!");
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        else {
            console.log("Unable to connect the Database");
        }
        console.log(error);
        process.exit(1);
    }
};
export default connectDB;
