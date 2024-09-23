import e from "express";  
import { User } from "../../../services/db/models/index.js";
import { FAILED_TO_CREATE_USER, UNVALID_PAYLOAD_DATA } from "../../../services/errors/index.js";
import { createTokenFromUserInfo, setTokenCookie } from "../../../services/cookie/auth/index.js";
import { getDocumentValidationErrorsInStringFormat } from "../../../services/errors/modelValidation/index.js";
import { loginAndRegisterLimiter } from "../../middlewares/limiters/loginAndRegister.js";

const registerRouter = e.Router();


registerRouter.post("/",loginAndRegisterLimiter, e.json({ limit: "kb" }), async (req, res) => {
  const { name, password, confirmedPassword } = req.body;

  // Compare passwords
  if(password !== confirmedPassword) {
    return res.status(UNVALID_PAYLOAD_DATA.status).send({ success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage("Your password differs from your password confirmation")});
  };

  // Instace user and validate props
  const user = new User({ name, password });
  const validation = user.validateSync();

  if(validation != undefined) { // if user is unvalid
    return res
    .status(UNVALID_PAYLOAD_DATA.status)
    .send({ 
      success: false, 
      error: UNVALID_PAYLOAD_DATA.getWithCustomMessage(getDocumentValidationErrorsInStringFormat(validation))
    });
  };


  // Save user
  let docSaved;
  try {
    docSaved = await user.save({ validateBeforeSave: false });
  }
  catch(error) {
    return res.status(FAILED_TO_CREATE_USER.status).send({ success: false, error: FAILED_TO_CREATE_USER.getWithCustomMessage(error.message) });
  };


  // Set cookies:
  const publicUserInfo = { name: docSaved.name, _id: docSaved._id };
  setTokenCookie(res, createTokenFromUserInfo(publicUserInfo));  
  res.cookie("name", docSaved.name);
  res.cookie("_id", docSaved._id);

  return res.status(201).send({ success: true, data: publicUserInfo });

});

export default registerRouter;