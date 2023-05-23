import { Router } from "express";
import { MessageController } from "./controller.js";
import { checkToken } from "../../middlewares/token.check.js";

const messageRouter = Router();

messageRouter.post('/', checkToken, MessageController.sendMessage)
messageRouter.get('/:chatId', checkToken, MessageController.allMessages)



export default messageRouter;