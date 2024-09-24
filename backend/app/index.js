import e from "express";
import cookieParser from "cookie-parser";
import viteRouter from "./routers/vite/index.js";
import registerRouter from "./routers/register/index.js";
import loginRouter from "./routers/login/index.js";
import userRouter from "./routers/user/index.js";
import eventRouter from "./routers/event/index.js";
import invitationRouter from "./routers/invitation/index.js";
import filesRouter from "./routers/files/index.js";
import { authorizationRequired } from "./middlewares/auth/index.js";
import { clearAllCookies } from "../services/cookie/auth/index.js";
import { ACTION_WAS_NOT_IMPLEMENTED } from "../services/errors/index.js";

const app = e();


app.use(cookieParser());

app.get("/api", (_, res) => {
  res.status(500).send({ asd: "adqwd"})
})

app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", authorizationRequired(), async (req, res) => {
  clearAllCookies(res);
  return res.status(200).send({ success: true });
})

app.use("/api/user", userRouter);



app.use("/api/event", eventRouter);
app.use("/api/invitation", invitationRouter);
app.use("/api/file", filesRouter);
app.use("/api", (_, res) => res.status(501).send({ success: false, error: ACTION_WAS_NOT_IMPLEMENTED.getWithCustomMessage("That route was not implemented")}))

app.use(viteRouter);


export default app;