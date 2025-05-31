import express from "express";
import userRouter from "./src/routes/user.route.js";
import authRouter from "./src/routes/auth.route.js";
import pollRouter from "./src/routes/poll.route.js";
import voteRouter from "./src/routes/vote.route.js";
import uploadRouter from "./src/routes/upload.route.js";
import dotenv from "dotenv";
import connect from "./src/config/database.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/handlers/error-handle.js";

dotenv.config(); //Phải là dòng đầu tiên!
connect();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Phân tích form data
app.use(cookieParser());
app.use("/api/v1", userRouter); 
app.use("/api/v1", authRouter); 
app.use("/api/v1", pollRouter); 
app.use("/api/v1", voteRouter); 
app.use("/upload", uploadRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    error: "NOT FOUND",
  });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//errorHandler( asyncErrorHandler( controller.fn( service ) )  )