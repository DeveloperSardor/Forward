import { Router } from "express";
import { checkToken } from "../../middlewares/token.check.js";
import { CommentController } from "./controller.js";

const CommentRouter = Router();

// Get Methods

CommentRouter.get(
  "/comments",
  checkToken,
  CommentController.GetComments
);
CommentRouter.get(
  "/comment/liked/user/:id",
  checkToken,
  CommentController.GetLikedCommentUser
);
CommentRouter.get(
  "/comment/disliked/user/:id",
  checkToken,
  CommentController.GetDisLikedCommentUser
);

// Post Methods
CommentRouter.post("/comment/add", checkToken, CommentController.AddComment);

// Put Methods
CommentRouter.put(
  "/comment/add/like/:id",
  checkToken,
  CommentController.likeTheComment
);

CommentRouter.put(
  "/comment/add/dislike/:id",
  checkToken,
  CommentController.DisLikeTheComment
);

CommentRouter.put("/comment/:id", checkToken, CommentController.EditComment);

// Delete Methods
CommentRouter.delete(
  "/comment/:id",
  checkToken,
  CommentController.DeleteComment
);


CommentRouter.delete('/comment/like/:id', checkToken, CommentController.deleteFromLike)
CommentRouter.delete('/comment/dislike/:id', checkToken, CommentController.deleteFromDislike)

export default CommentRouter;
