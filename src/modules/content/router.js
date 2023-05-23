import { Router } from "express";
import { checkToken } from "../../middlewares/token.check.js";
import { ContentController } from "./controller.js";

const ContentRouter = Router();

// Get Methods
ContentRouter.get("/contents", checkToken, ContentController.GetContent);
ContentRouter.get("/contents/:id", checkToken, ContentController.GetContent);

ContentRouter.get("/downloads", checkToken, ContentController.GetMyDownloads);

// Get Viewers
ContentRouter.get(
  "/contents/viewers/:id",
  checkToken,
  ContentController.GetViewersContent
);

// Get Liked Users
ContentRouter.get(
  "/liked",
 checkToken,
  ContentController.GetLikedContents
);

// Get Disliked Users
ContentRouter.get(
  "/contents/disliked/:id",
  checkToken,
  ContentController.GetUserDisikedContent
);

ContentRouter.get("/histories", checkToken, ContentController.GetMyHistories);

// Post Methods
ContentRouter.post("/contents", checkToken, ContentController.PostContent);

// Put Methods
ContentRouter.put("/contents/like/:id", checkToken, ContentController.addLike);

ContentRouter.put(
  "/contents/dislike/:id",
  checkToken,
  ContentController.addDisLike
);

ContentRouter.put(
  "/contents/viewers/:id",
  checkToken,
  ContentController.AddViewers
);

ContentRouter.put("/contents/:id", checkToken, ContentController.UpdateContent);

ContentRouter.put(
  "/contents/download/:id",
  checkToken,
  ContentController.DownloadHandler
);
ContentRouter.put(
  "/contents/history/:id",
  checkToken,
  ContentController.AddHistoryContent
);

// Delete Methods
ContentRouter.delete(
  "/contents/:id",
  checkToken,
  ContentController.DeleteContent
);

ContentRouter.delete(
  "/contents/dislike/:id",
  checkToken,
  ContentController.deleteFromDislike
);
ContentRouter.delete(
  "/contents/like/:id",
  checkToken,
  ContentController.deleteFromLike
);

ContentRouter.delete(
  "/histories/clear/all",
  checkToken,
  ContentController.clearAllHistories
);
ContentRouter.delete(
  "/histories/:id",
  checkToken,
  ContentController.deleteContentFromHistory
);
ContentRouter.delete(
  "/downloads/clear/all",
  checkToken,
  ContentController.clearAllDownloads
);
ContentRouter.delete(
  "/downloads/:id",
  checkToken,
  ContentController.deleteContentFromDownloads
);
ContentRouter.delete(
  "/liked/clear/all",
  checkToken,
  ContentController.clearAllLikedContents
);
ContentRouter.delete(
  "/liked/:id",
  checkToken,
  ContentController.deleteContentFromLiked
);

export default ContentRouter;
