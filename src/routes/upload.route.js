import { Router } from "express";
import uploadStorage from "../config/multer.config.js";
import { UploadController } from "../controllers/upload.controller.js";
import asyncHandler from "../middlewares/asyncHandle.js";
const router = Router();

router.post(
  "/single",
  uploadStorage.single("file"),
  asyncHandler(UploadController.uploadSingleFile)
);
router.post(
  "/multiple",
  uploadStorage.array("files", 10),
  asyncHandler(UploadController.uploadMultipleFiles)
);

export default router;
