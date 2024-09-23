import e from "express";
import { User } from "../../../services/db/models/index.js";
import { UNVALID_PAYLOAD_DATA } from "../../../services/errors/index.js";
import { getSpecificUserRateLimiter, getUsersRateLimiter } from "../../middlewares/limiters/user.js";



const userRouter = e.Router();


userRouter.get("/", getUsersRateLimiter, async (req, res) => {
  const { search } = req.query;

  let result;
  if(typeof search === "string" && search.length > 0) { // if search quey is present search for users
    result = await User.getUsers({ search, ...req.query });
  }
  else {
    return res.status(UNVALID_PAYLOAD_DATA.status).send({ success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage("The search query key is empty") });
  }

  return res.status(result.error?.status ?? 200).send(result);

});

userRouter.get("/:user_id", getSpecificUserRateLimiter, async (req, res) => {
  
  let user_id = req.params.user_id;


  // if there is user_id
  const result = await User.getUserPublicInfo(user_id);

  return res.status(result.error?.status ?? 200).send(result);
});


export default userRouter;