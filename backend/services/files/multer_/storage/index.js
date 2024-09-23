import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { manageUnhandledServerError } from "../../../errors/management/index.js";
import process from "node:process";


if(Boolean(process.env.TMP_UPLOADS_FOLDER) === false || typeof process.env.TMP_UPLOADS_FOLDER !== "string") {
  throw new Error("no TMP_UPLOADS_FOLDER was specified in process.env")
}

const multerDiskStorageFolderPath = path.join(process.cwd(), process.env.TMP_UPLOADS_FOLDER);

export const multerDiskStorage = multer.diskStorage({
  destination: multerDiskStorageFolderPath,
});

export async function fileFromMulterStorageWasUsed(filename) {
  try {
    fs.unlinkSync(filename);
  }
  catch(err) {
    manageUnhandledServerError(err);
  };
};
