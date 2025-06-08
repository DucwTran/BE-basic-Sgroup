import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./src/handlers/error-handle.js";
import setupRoutes from "./src/routes/index.route.js";
import connect from "./src/config/database.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

setupRoutes(app);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
