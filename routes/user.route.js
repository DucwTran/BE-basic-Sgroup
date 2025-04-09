import { Router } from "express";
// import {
//   readDatabaseFile,
//   writeDatabaseFile,
// } from "../src/utils/handleWithFile.js";
import { validateCreateUser } from "../src/middlewares/validateCreateUser.js";
import { validatePatchUser } from "../src/middlewares/validatePatchUser.js";
import fs from "fs";

const DB_PATH = "./database.json"; // Đường dẫn đến file JSON
// Hàm đọc dữ liệu từ file JSON
export function readDatabaseFile(DB_PATH) {
  const jsonData = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(jsonData);
}
// Hàm ghi dữ liệu vào file JSON
export function writeDatabaseFile(DB_PATH, updatedData) {
  fs.writeFileSync(DB_PATH, JSON.stringify(updatedData, null, 2), "utf-8");
}

const router = Router();

// const middleWareUser = (req, res, next) => {
//   console.log("User MiddleWare");
//   next();
// };

// GET - Lấy danh sách tất cả người dùng
router.get("/users", (req, res) => {
  const database = readDatabaseFile(DB_PATH);
  res.status(200).json(database.users);
});

//GET - Lấy người dùng theo ID
router.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const database = readDatabaseFile(DB_PATH);
  const user = database.users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  } else {
    return res.status(200).json(user);
  }
});

//POST - Tạo thêm 1 người dùng
router.post("/users", validateCreateUser, (req, res) => {
  const { fullName, address, email, gender, phone, age } = req.body[0];
  console.log(req.body[0]);
  if (!fullName || !address || !email || !gender || !phone || !age) {
    return res.status(400).json({
      message: "vui lòng nhập đủ thông tin user",
    });
  }

  const database = readDatabaseFile(DB_PATH);
  const newUserId =
    database.users.length > 0
      ? database.users[database.users.length - 1].id + 1
      : 1;
  const newUser = {
    id: newUserId,
    fullName,
    email,
    gender,
    age,
    phone,
    address,
  };
  database.users.push(newUser);
  writeDatabaseFile(DB_PATH, database);

  res.status(201).json({
    message: "Tạo người dùng thành công.",
    user: newUser,
  });
});

// PUT - Cập nhật toàn bộ thông tin người dùng theo ID
router.put("/users/:id", validateCreateUser, (req, res) => {
  const userId = parseInt(req.params.id);
  const { fullName, address, email, gender, phone, age } = req.body[0];
  console.log("id: ", req.params.id);
  console.log("req.body: ", req.body);
  if (!fullName || !address || !email || !gender || !phone || !age) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ họ tên và địa chỉ.",
    });
  }

  const database = readDatabaseFile(DB_PATH);
  console.log("database: ", database);
  const userIndex = database.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Không tìm thấy người dùng." });
  }

  database.users[userIndex] = {
    id: userId,
    fullName,
    address,
    email,
    gender,
    phone,
    age,
  };

  writeDatabaseFile(DB_PATH, database);
  res.status(200).json({
    message: "successfully",
  });
});

// PATCH - Cập nhật một phần thông tin người dùng theo ID
router.patch("/users/:id", validatePatchUser, (req, res) => {
  const userId = parseInt(req.params.id);
  const database = readDatabaseFile(DB_PATH);
  const user = database.users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log(user);
  Object.assign(user, req.body[0]);
  writeDatabaseFile(DB_PATH, database);
  res.status(200).json({
    message: "User partially updated",
    user,
  });
});

// DELETE - Xóa người dùng theo ID
router.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const database = readDatabaseFile(DB_PATH);
  const userIndex = database.users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  const deletedUser = database.users.splice(userIndex, 1)[0];
  writeDatabaseFile(DB_PATH, database);
  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser,
  });
});

export default router;
