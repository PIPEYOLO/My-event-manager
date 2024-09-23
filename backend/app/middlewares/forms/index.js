import multer from "multer";
import { multerDiskStorage } from "../../../services/files/multer_/storage/index.js";
import process from "node:process";
export const entityPhotoMulterInstance = multer({
  storage: multerDiskStorage,
  limits: {
    fileSize: process.env.PUBLIC_FILE_UPLOADED_MAX_SIZE
  }
});


export const eventCreationAndEditionMulterInstance = multer({
  storage: multerDiskStorage,
  limits: {
    fieldNameSize: 200,
    fieldSize: 1e6,
    fields: 10,
    files: 1,
    fileSize: process.env.PUBLIC_FILE_UPLOADED_MAX_SIZE
  }
});

