export class UploadService {
  static handleSingleFileUpload(file) {
    if (!file) {
      throw new Error("Không có file nào được tải lên");
    }
    return {
      message: "Tải lên file thành công",
      file,
    };
  }

  static handleMultipleFilesUpload(files) {
    if (!files || files.length === 0) {
      throw new Error("Không có file nào được tải lên");
    }

    return {
      message: "Tải lên nhiều file thành công",
      files,
    };
  }
}
