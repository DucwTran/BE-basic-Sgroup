import { Router } from "express";
import fs from "fs";

const router = Router();
const DB_PATH = "./database.json"; // Đường dẫn đến file JSON


// nên thêm try, catch để xử lý các lỗi có thể xảy ra khi thao tác với file
// Hàm đọc dữ liệu từ file JSON
function readDatabaseFile() {
  const jsonData = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(jsonData);
}

// Hàm ghi dữ liệu vào file JSON
function writeDatabaseFile(updatedData) {
  fs.writeFileSync(DB_PATH, JSON.stringify(updatedData, null, 2), "utf-8");
}

// GET - Lấy danh sách tất cả người dùng
router.get("/users", (req, res) => {
  const database = readDatabaseFile();
  res.status(200).json(database.users);
});

// thiếu xử lý trường hợp không tìm thấy user 
// GET - Lấy thông tin người dùng theo ID
router.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id); 
  const database = readDatabaseFile(); 
  const user = database.users.find(user => user.id === userId); 
  res.status(200).json(user); 
});

// POST - Tạo người dùng mới
router.post("/users", (req, res) => {
  const { fullName, address } = req.body;
  // kiểm tra xem có truyền đầy đủ thông tin không 
  const database = readDatabaseFile();
  const newUserId =
    database.users.length > 0
      ? database.users[database.users.length - 1].id + 1
      : 1;
  const newUser = {
    id: newUserId,
    fullName,
    address,
  };
  database.users.push(newUser);
  writeDatabaseFile(database);
  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

// PUT - Cập nhật toàn bộ thông tin người dùng theo ID
router.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { fullName, address } = req.body;
  // kiểm tra xem có truyền đầy đủ thông tin không 
  const database = readDatabaseFile();
  const userIndex = database.users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  database.users[userIndex] = { id: userId, fullName, address };
  writeDatabaseFile(database);
  res.status(204).end();
});

// PATCH - Cập nhật một phần thông tin người dùng theo ID
router.patch("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const database = readDatabaseFile();
  const user = database.users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  Object.assign(user, req.body);
  writeDatabaseFile(database);
  res.status(200).json({
    message: "User partially updated",
    user,
  });
});

// DELETE - Xóa người dùng theo ID
router.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const database = readDatabaseFile();
  const userIndex = database.users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  const deletedUser = database.users.splice(userIndex, 1)[0];
  writeDatabaseFile(database);
  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser,
  });
});

export default router;
