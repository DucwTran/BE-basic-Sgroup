import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.route.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Trang chủ")
})

app.listen(PORT, () => {    
  console.log(`Server is running on http://localhost:${PORT}`);
});
