import mongoose, { Document, mongo } from "mongoose";
import validator from "validator";


interface UserType extends Document {
    _id:string;
    name:string;
    email:string;
    photo:string;
    gender:"male"|"female",
    role:"user"|"admin",
    DOB:Date;
    createdAt: Date;
    updatedAt:Date;

    // this is virtual attribute
    age:number;

}


const userSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:[true,"Enter id"]
    },
    name:{
        type:String,
        required:[true,"Enter name"]
    },
    email:{
        type:String,
        required:[true,"Enter email"],
        validate: validator.default.isEmail
    },
    photo:{
        type:String,
        required:[true,"Add Photo"]
    },
    gender:{
        type:String,
        required:[true,"Enter gender"],
        enum:["male","female"]
    },
    role:{
        type:String,
        required:[true,"Enter role"],
        enum:["user","admin"]
    },
    DOB:{
        type:Date,
        required:[true,"Enter Date of Birth"]
    }
},{
    timestamps:true,
})

userSchema.virtual("age").get(function(this:UserType){
    const today = new Date();
    const dob  = this.DOB;

    let age = today.getFullYear() - dob.getFullYear();
    
    if(today.getMonth() < dob.getMonth() || (today.getMonth()===dob.getMonth() && today.getDate()<dob.getDate())){
        age--;
    }

    return age;

     
})

export const User = mongoose.model<UserType>("User",userSchema);

