import e from "express";
import { compareSync } from "bcrypt";
import { INCORRECT_PASSWORD, UNVALID_PAYLOAD_DATA } from "../../../services/errors/index.js";
import { User } from "../../../services/db/models/index.js";
import { getDocumentValidationErrorsInStringFormat } from "../../../services/errors/modelValidation/index.js";
import { createTokenFromUserInfo, setTokenCookie } from "../../../services/cookie/auth/index.js";
import { loginAndRegisterLimiter } from "../../middlewares/limiters/loginAndRegister.js";

const loginRouter = e.Router();


loginRouter.post("/", loginAndRegisterLimiter, e.json({ limit: "2kb"}), async (req, res) => {
  const { name, password } = req.body;
  
  // Instance the user:
  const user = new User({ name, password });

  // Validate user auth info
  const validation = user.validateSync(["name", "password"]);
  if(validation != undefined) {
    const message = getDocumentValidationErrorsInStringFormat(validation);
    return res.status(UNVALID_PAYLOAD_DATA.status).send({ success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage(message)})
  }

  // Find the user
  const userInDBResult = await User.findUserByName(name);

  if(userInDBResult.success === false) { // if smth is not ok, rebound
    const error = userInDBResult.error;
    return res.status(error.status).send(userInDBResult);
  };


  // If the user exists:
  const { _id, password: hashedPassword } = userInDBResult.data;
  const pwdComparison = compareSync(password, hashedPassword);

  if(pwdComparison === false) {
    return res.status(INCORRECT_PASSWORD.status).send({ success: false, error: INCORRECT_PASSWORD });
  }


  // if all is correct:
  const publicUserInfo = { name: name, _id: _id };
  setTokenCookie(res, createTokenFromUserInfo(publicUserInfo));
  res.cookie("name", name);
  res.cookie("_id", _id);

  return res.status(200).send({ success: true, data: publicUserInfo });

});


export default loginRouter;