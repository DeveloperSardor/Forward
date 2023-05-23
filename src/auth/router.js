import { Router } from "express";
import { Register } from "./register/controller.js";
import { Login, PassCode } from "./login/controller.js";

const AuthRouter = Router();

AuthRouter.post("/signup", Register);
AuthRouter.post("/login", Login);
AuthRouter.post("/pass/code", PassCode);

export default AuthRouter;
