import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});
userSchema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.DOB;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", userSchema);
