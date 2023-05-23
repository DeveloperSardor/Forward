import { Router } from "express";
import AuthRouter from "../auth/router.js";
import CategoryRouter from "../modules/categories/router.js";
import ContentRouter from "../modules/content/router.js";
import UserRouter from "../modules/users/router.js";
import CommentRouter from "../modules/comments/routes.js";
import roleRouter from "../modules/role/router.js";
import chatRouter from "../modules/chat/router.js";
import messageRouter from "../modules/messages/router.js";

const router = Router();

router.use(AuthRouter)
router.use(roleRouter)
router.use(CategoryRouter)
router.use(ContentRouter)
router.use(UserRouter)
router.use(CommentRouter)
router.use('/chat', chatRouter)
router.use('/message', messageRouter)


export default router;