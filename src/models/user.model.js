import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  address: String,
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  gender: {
    type: String,
  },
  phone: String,
  age: Number,
  otp: String,
  otpExpiresAt: Date,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const User = mongoose.model("User", userSchema, "users");

export default User;