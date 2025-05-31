import mongoose from "mongoose";
import Vote from "../models/vote.model.js"

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect Success");
    await Vote.createIndexes();
    console.log("Vote indexes ensured");
  } catch (error) {
    console.log("Connect Error:", error.message);
  }
};

export default connect;
