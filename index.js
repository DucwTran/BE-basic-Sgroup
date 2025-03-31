import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Tran Cong Duc",
    age: 18,
  });
});

app.listen(PORT, () => {
  console.log(`Đang nghe port: ${PORT}`);
  console.log(parseInt(PORT))
});
