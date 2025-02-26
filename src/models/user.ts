import mongoose from "mongoose";
import validator from "validator";
import { UserType } from "../types/modelType.js";

const userSchema = new mongoose.Schema<UserType>(
  {
    id: {
      type: String,
      required: [true, "Please provide uid of the user"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Enter name"],
    },
    email: {
      type: String,
      required: [true, "Enter email"],
      validate: validator.default.isEmail,
      unique: true,
    },
    photo: {
      type: String,
      required: [true, "Add Photo"],
    },
    gender: {
      type: String,
      required: [true, "Enter gender"],
      enum: ["male", "female"],
    },
    role: {
      type: String,
      required: [true, "Enter role"],
      enum: ["user", "admin"],
    },
    DOB: {
      type: Date,
      required: [true, "Enter Date of Birth"],
    },
  },
  {
    timestamps: true,
    _id:false,
  }
);

userSchema.virtual("age").get(function (this: UserType) {
  const today = new Date();
  const dob = this.DOB;

  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
});

export const User = mongoose.model("User", userSchema);
