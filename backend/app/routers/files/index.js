import e from "express";
import { readFileDataFromDB } from "../../../services/files/db/index.js";
import { parseAndValidateOptions } from "../../../services/options/parseAndValidate/index.js";
import { getFileRateLimiter } from "../../middlewares/limiters/files.js";

const filesRouter = e.Router();

filesRouter.get("/:file_id", getFileRateLimiter, async (req, res) => {

  const { file_id } = req.params
  const { start, end } = req.query;

  const parsedOptionsInfo = parseAndValidateOptions({ start, end }, { start: 0, end: Number.MAX_SAFE_INTEGER })
  const fileInfo = await readFileDataFromDB(file_id, parsedOptionsInfo.options);
  
  if(fileInfo.success === false) return res.status(fileInfo.error.status).send();

  return res.status(200).contentType(fileInfo.metadata.mimetype ?? undefined).send(fileInfo.data); 
});


export default filesRouter;
