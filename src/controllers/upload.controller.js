import { UploadService } from "../services/upload.service.js";

export class UploadController {
  static async uploadSingleFile(req, res) {
    const result = UploadService.handleSingleFileUpload(req.file);
    return res.status(200).json(result);
  }

  static async uploadMultipleFiles(req, res) {
    const result = UploadService.handleMultipleFilesUpload(req.files);
    return res.status(200).json(result);
  }
}
