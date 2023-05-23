import { Router } from "express";
import { checkToken } from "../../middlewares/token.check.js";
import { ChatController } from "./controller.js";


const chatRouter  = Router()
  

chatRouter.route('/')
 .post(checkToken, ChatController.accessChat)
 .get(checkToken, ChatController.fetchChats)


 chatRouter.post('/group', checkToken, ChatController.createGroupChat)
 chatRouter.post('/rename/:chatId', checkToken, ChatController.renameGroup)
 chatRouter.post('/group/add', checkToken, ChatController.addToGroup)
 chatRouter.post('/group/remove', checkToken, ChatController.createGroupChat)


export default chatRouter;