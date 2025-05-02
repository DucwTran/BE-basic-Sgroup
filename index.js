import express from "express";
import userRouter from "./src/routes/user.route.js";
import dotenv from "dotenv";
import connect from "./src/config/database.js";
import multer from "multer";
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

app.use("/", userRouter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

// Single file
app.post("/upload/single", uploadStorage.single("file"), (req, res) => {
  console.log(req.file);
  return res.send("Single file");
});
//Multiple files
app.post("/upload/multiple", uploadStorage.array("files", 10), (req, res) => {
  console.log(req.files);
  return res.send("Multiple files");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
