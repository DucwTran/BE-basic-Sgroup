import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isLocked: { type: Boolean, default: false },
    options: [
      {
        text: String,
      },
    ],
  },
  { timestamps: true }
);


const Poll = mongoose.model("Poll", pollSchema, "polls");

export default Poll;