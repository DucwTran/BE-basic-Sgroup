import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  otp: String,
  otpExpiresAt: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema, "users");

export default User;
