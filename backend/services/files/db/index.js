import mongoose, { mongo } from "mongoose";
import crypto from "node:crypto"
import fs from "node:fs";
import { FILE_NOT_FOUND, UNEXPECTED_SERVER_ERROR } from "../../errors/index.js";
import { manageUnhandledServerError } from "../../errors/management/index.js";
import { fileFromMulterStorageWasUsed } from "../multer_/storage/index.js";
import { castFieldsToObjectId } from "../../object_id/index.js";

function getBucket() {
  const client = mongoose.connection.getClient();
  const db = client.db(process.env.DB_NAME);
  const bucket = new mongo.GridFSBucket(db, {
    bucketName: "media",
  });
  return bucket;
};


const CHUNK_SIZE = 2**18;

function getFilename(metadata) {
  const filename = metadata.originalname + "_" + crypto.randomUUID();
  return filename;
};

export function uploadFileToDB(filePath, fileInfo) {
  return new Promise(resolve => {
    const bucket = getBucket();

    const readStream = fs.createReadStream(filePath, {
      highWaterMark: CHUNK_SIZE
    });

    const filenameForDB = getFilename(fileInfo); // create a random filename for this new file
    const { originalname, mimetype } = fileInfo;
    
    const uploadStream = bucket.openUploadStream(filenameForDB, {
      metadata: { originalname, mimetype},
      chunkSizeBytes: CHUNK_SIZE
    });
  
    const file_id = uploadStream.id;
    
    readStream.pipe(uploadStream);
  
    uploadStream.on("finish", () => resolve({ success: true, data: { _id: file_id }}));
    uploadStream.on("error", (err)=> {
      manageUnhandledServerError(err);
      resolve({ success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not save file in db") });
    })
    uploadStream.on("close", () => fileFromMulterStorageWasUsed(filePath)); // we tell the multer diskstorage that we have already used the file
  });
};

export async function readFileDataFromDB(_id, options={ start: 0, end: Number.MAX_SAFE_INTEGER }) {
  let { start, end } = options;
  const _idInfo = castFieldsToObjectId({ _id });
  if(_idInfo.success === false) return _idInfo;
  
  _id = _idInfo.data._id;

  return new Promise(async resolve => {
    const bucket = getBucket();
    
    let result;
    try {
      result = await bucket.find({ _id }, { limit: 1, projection: { length: 1, metadata: 1 } }).toArray();
    }
    catch(err) {
      manageUnhandledServerError(err);
      return resolve({ success: false, error: UNEXPECTED_SERVER_ERROR })
    };
    const fileDoc = result[0];

    if(fileDoc == null) return resolve({ success: false, error: FILE_NOT_FOUND });

    // Once we kwnow that the file exists
    end = Math.min(end, fileDoc.length);
    
    const fileDataBuffer = Buffer.alloc(end - start);
    let currentWriteIdx = 0;

    const downloadStream = bucket.openDownloadStream(_id, { start, end });

    downloadStream.on("data", (chunk) => {
      fileDataBuffer.set(chunk, currentWriteIdx);
      currentWriteIdx += chunk.length;
    })
    downloadStream.on("end", () => resolve({ success: true, data: fileDataBuffer, metadata: fileDoc.metadata }));
    downloadStream.on("error", (err) => {
      manageUnhandledServerError(err);
      resolve({ success: false, error: UNEXPECTED_SERVER_ERROR })
    })
  });
}

export async function getFileDocById(_id) {
  let result;
  try {
    result = await getBucket().find(_id, { limit: 1 }).toArray();
  }
  catch(err) {
    manageUnhandledServerError(err);
    return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get file doc") };
  }

  return { success: true, data: result[0] };
};

export async function deleteFileFromDB(_id, { okIfNotFound=true }) {
  const bucket = getBucket();
  let fileDoc;
  try {
    fileDoc = await bucket.find({ _id }, { _id: 1 }).toArray();
  }
  catch(err) {
    return { success: false, error: UNEXPECTED_SERVER_ERROR }
  };

  if(fileDoc == null) return { success: false, error: FILE_NOT_FOUND };

  try {
    await bucket.delete(_id);
  }
  catch(err) {
    if(/file not found/i.test(err.message) === true && okIfNotFound === true) {} 
    else {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not delete document") };
    }
  };

  return { success: true, data: { _id } };
}





