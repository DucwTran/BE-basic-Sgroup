import express from "express";
import userRouter from "./src/routes/user.route.js";
import dotenv from "dotenv";
import connect from "./src/config/database.js";
dotenv.config();
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

app.set("view engine", "pug");
app.set("views", "./src/views");

app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
