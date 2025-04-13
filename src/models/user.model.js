import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: Number,
  name: String
});

const User = mongoose.model("User", userSchema, "users");

export default User;
