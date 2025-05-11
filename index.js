import express from "express";
import userRouter from "./src/routes/user.route.js";
import authRouter from "./src/routes/auth.route.js";
import uploadRouter from "./src/routes/upload.route.js";
import dotenv from "dotenv";
import connect from "./src/config/database.js";
import cookieParser from "cookie-parser";

dotenv.config(); //Phải là dòng đầu tiên!
connect();
const PORT = process.env.PORT;
const app = express();

const middleWare = (req, res, next) => {
  console.log("Global middleWare");
  next();
};

app.use(middleWare);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Phân tích form data
app.use(cookieParser());
app.use("/api/v1", userRouter); 
app.use("/api/v1", authRouter); 
app.use("/upload", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
