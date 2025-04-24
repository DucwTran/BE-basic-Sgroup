import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  address: String,
  email: {
    type: String,
    unique: true,
  },
  gender: {
    type: String,
  },
  phone: String,
  age: Number,
});

const User = mongoose.model("User", userSchema, "users");

export default User;