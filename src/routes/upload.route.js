import { Router } from "express";
import uploadStorage from "../config/multer.config.js";
import UploadController from "../controllers/upload.controller.js";

const router = Router();

router.post(
  "/single",
  uploadStorage.single("file"),
  UploadController.uploadSingleFile
);
router.post(
  "/multiple",
  uploadStorage.array("files", 10),
  UploadController.uploadMultipleFiles
);

export default router;
