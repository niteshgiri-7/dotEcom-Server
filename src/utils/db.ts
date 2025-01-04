import mongoose, { Error } from "mongoose";
const DB_URL = "mongodb://localhost:27017"
const connectDB = async()=>{
    try {
        await mongoose.connect(DB_URL,{
            dbName:"Ecommerce_TS"
        })
        console.log("Connected to Database successfully!")
    } catch (error) {
        if(error instanceof Error){
            console.log(error.message);
        }
        else{
            console.log("Unable to connect the Database");
        }

        process.exit(1);
    }
}

export default connectDB;