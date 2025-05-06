export class UploadController {
  // Hàm xử lý upload file đơn
  static uploadSingleFile(req, res) {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Không có file nào được tải lên" });
    }
    console.log(req.file);
    return res.status(200).json({
      message: "Tải lên file thành công",
      file: req.file,
    });
  }

  // Hàm xử lý upload nhiều file
  static uploadMultipleFiles(req, res) {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có file nào được tải lên" });
    }
    console.log(req.files);
    return res.status(200).json({
      message: "Tải lên nhiều file thành công",
      files: req.files,
    });
  }
}

export default UploadController;
