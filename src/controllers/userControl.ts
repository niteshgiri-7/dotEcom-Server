import { Request,Response } from "express"
import { User } from "../models/User.js"

export const signUp = async(req:Request,res:Response)=>{
    // let newUser = new User(req.body);
    const response = await User.create(req.body)
    res.status(201).json({message:"user saved"})
}