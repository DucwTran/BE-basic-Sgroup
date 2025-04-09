import fs from "fs";

// Hàm đọc dữ liệu từ file JSON
export function readDatabaseFile(DB_PATH) {
  const jsonData = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(jsonData);
}

// Hàm ghi dữ liệu vào file JSON
export function writeDatabaseFile( DB_PATH,updatedData) {
  fs.writeFileSync(DB_PATH, JSON.stringify(updatedData, null, 2), "utf-8");
}
