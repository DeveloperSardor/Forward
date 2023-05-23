import ContentModel from "../../modules/content/schema.js";
import CommentModel from "../../modules/comments/schema.js";
import UserModel from "../../modules/users/schema.js";
import { VERIFY } from "../../utils/jwt.js";

// UserModel.createIndexes({tit })

export class ContentController {
  constructor() {}
  // Get Methods
  static async GetContent(req, res) {
    try {
      let { id } = req.params;
      let { type } = req.query;
      let keyword = req.query.search
        ? {
            $or: [
              { title: { $regex: req.query.search, $options: "i" } },
              { description: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};
      if (id) {
        let u = await ContentModel.findById(id).populate("user");

        res
          .send({
            status: 200,
            success: true,
            message: `Ok`,
            link: `http://localhost:5000/contents/download/${id}}`,
            data: u,
          })
          .status(200);
      } else if (req.query?.search) {
        let contents = await ContentModel.find(keyword)
          .select("-like -dislike -description -download")
          .populate("user", "username avatar_path checkMark");
        res
          .send({
            status: 200,
            success: true,
            message: `Ok`,
            data: contents,
          })
          .status(200);
      } else if (type) {
        let contents = await ContentModel.find({
          type_content: type?.toLowerCase(),
        })
          .select("-like -dislike -description -download")
          .populate("user", "username avatar_path checkMark");
        res
          .send({
            status: 200,
            success: true,
            message: `Ok`,
            data: contents,
          })
          .status(200);
      } else {
        let contents = await ContentModel.find()
          .select("-like -dislike -description -download")
          .sort({ created_at: -1 })
          .populate("user", "username avatar_path checkMark");
        res
          .send({
            status: 200,
            success: true,
            message: `Ok`,
            data: contents,
          })
          .status(200);
      }
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  // Get  people who liked the content

  static async GetContentLikedUser(req, res) {
    try {
      let { id } = req.params;
      let findByIdContent = await ContentModel.findById(id).populate(
        "like",
        "username avatar_path followers followed checkMark"
      );
      if (!findByIdContent) throw new Error(`Not Found ${id} - Content`);
      res.send({
        message: "Liked users",
        status: 200,
        success: true,
        data: findByIdContent.like,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  // Get  people who disliked the content

  static async GetUserDisikedContent(req, res) {
    try {
      let { id } = req.params;
      let findByIdContent = await ContentModel.findById(id).populate(
        "dislike",
        "username avatar_path followers followed checkMark _id"
      );
      if (!findByIdContent) throw new Error(`Not Found ${id} - Content`);
      res.send({
        message: "Disliked users",
        status: 200,
        success: true,
        data: findByIdContent.dislike,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  static async GetViewersContent(req, res) {
    try {
      let { id } = req.params;
      let findById = await ContentModel.findById(id).populate(
        "viewers",
        "username avatar_path followers followed checkMark _id"
      );
      if (!findById) throw new Error(`Not Found ${id} -content`);
      res.send({
        message: "Viewers Users",
        status: 200,
        success: true,
        data: findById.viewers,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  static async GetMyDownloads(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findUser = await UserModel.findById(user_id).populate({
        path: "download_content",
        populate: {
          path: "user",
          select: "username avatar_path checkMark",
        },
      });

      if (findUser.download_content == undefined) {
        throw new Error(`You haven't downloaded the content yet`);
      }
      let result = findUser.download_content?.map((content) => {
        return {
          content: {
            _id: content._id,
            title: content.title,
            type_content: content.type_content,
            viewers: content.viewers,
            created_at: content.created_at,
            content_path: content.content_path,
          },
          user: {
            _id: content.user._id,
            username: content.user.username,
            avatar_path: content.user.avatar_path,
          },
        };
      });
      res.send({
        status: 200,
        message: `Downloaded Contents`,
        success: true,
        data: result,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  static async GetMyHistories(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findUser = await UserModel.findById(user_id).populate({
        path: "history_content",
        populate: {
          path: "user",
          select: "username avatar_path checkMark",
        },
      });

      let result = findUser.history_content.map((content) => {
        return {
          content: {
            _id: content._id,
            title: content.title,
            type_content: content.type_content,
            viewers: content.viewers,
            created_at: content.created_at,
            content_path: content.content_path,
          },
          user: {
            _id: content.user._id,
            username: content.user.username,
            avatar_path: content.user.avatar_path,
          },
        };
      });
      res.send({
        status: 200,
        message: `Histories Videos`,
        success: true,
        data: result,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  // GetUserLikedContent
  static async GetLikedContents(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findUser = await UserModel.findById(user_id).populate({
        path: "liked_content",
        populate: {
          path: "user",
          select: "username avatar_path checkMark",
        },
      });
      if (findUser.liked_content == undefined) {
        throw new Error(`You haven't liked the content yet`);
      }

      let result = findUser.liked_content?.map((content) => {
        return {
          content: {
            _id: content._id,
            title: content.title,
            type_content: content.type_content,
            viewers: content.viewers,
            created_at: content.created_at,
            content_path: content.content_path,
          },
          user: {
            _id: content.user._id,
            username: content.user.username,
            avatar_path: content.user.avatar_path,
          },
        };
      });

      res.send({
        status: 200,
        message: `Liked Contents`,
        success: true,
        data: result,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  // Post Methods
  static async PostContent(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { title, type_content, content_path, category_content, description } =
        req.body;
      description = description ? description : null;
      if (!title || !type_content || !content_path || !category_content) {
        throw new Error(`Data is incomplated ❌`);
      }
      let newContent = await ContentModel.create({
        user: user_id,
        title,
        content_path,
        description,
        type_content: type_content.toLowerCase(),
        category_content,
      });
      await newContent.save();

      if (newContent == undefined) {
        throw new Error(`Not Added Content`);
      } else {
        let allContent = await ContentModel.find().populate("user");
        res
          .send({
            status: 201,
            link: `http://localhost:5000/contents/${newContent._id}`,
            message: `Successfuly Added Content✅`,
            success: true,
            data: allContent,
            added_content: await newContent,
          })
          .status(201);
      }
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  //  Put Methods

  static async UpdateContent(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { id } = req.params;
      let { title, content_path, type_content, description, category_content } =
        req.body;
      if (
        !title &&
        !content_path &&
        !type_content &&
        !description &&
        !category_content
      ) {
        throw new Error(`You are not sent some data❗`);
      }
      let findById = await ContentModel.findById(id);
      if (!findById) {
        throw new Error(`Not Found ${id} - content`);
      }
      if (findById.user != user_id) {
        throw new Error("you can only edit your own content❌");
      }
      let updatedContent = await ContentModel.findByIdAndUpdate(
        id,
        {
          title,
          content_path,
          type_content,
          description,
          category_content,
        },
      {new : true}
      );
      if (!updatedContent.hasOwnProperty) {
        throw new Error(`Not Updated ${findById.type_content}`);
      }
      res
        .send({
          status: 200,
          message: `Updated ✅`,
          success: true,
          data: await ContentModel.findById(id),
        })
        .status(200);
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  static async AddHistoryContent(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { id } = req.params;
      let findUserById = await UserModel.findById(user_id).populate({
        path: "history_content",
        populate: {
          path: "user",
          select: "username avatar_path chackMark",
        },
      });
      let findContentById = await ContentModel.findById(id);

      if (findContentById.type_content.toLocaleLowerCase() == "story") {
        throw new Error(`Only Video and Photo`);
      }

      let userCheck = await UserModel.findById(user_id);
      let histories = userCheck.history_content;
      let isExists = histories.includes(id);
      if (isExists) {
        let result = findUserById.history_content.map((content) => {
          return {
            content: {
              _id: content._id,
              title: content.title,
              viewers: content.viewers,
              created_at: content.created_at,
              content_path: content.content_path,
            },
            user: {
              _id: content.user._id,
              username: content.user.username,
              avatar_path: content.user.avatar_path,
            },
          };
        });
        res.send({
          status: 200,
          messsage: "ok",
          succes: true,
          data: await result,
        });
      } else {
        let newHistory = await UserModel.findByIdAndUpdate(
          user_id,
          { $push: { history_content: id } },
          { new: true }
        );

        let result = findUserById.history_content.map((content) => {
          return {
            content: {
              _id: content._id,
              title: content.title,
              viewers: content.viewers,
              created_at: content.created_at,
              content_path: content.content_path,
            },
            user: {
              _id: content.user._id,
              username: content.user.username,
              avatar_path: content.user.avatar_path,
            },
          };
        });
        res.send({
          status: 200,
          messsage: "ok",
          succes: true,
          data: await result,
        });
      }
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  static async DownloadHandler(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { id } = req.params;

      let findContentById = await ContentModel.findById(id);
      if (findContentById.type_content.toLocaleLowerCase() == "story") {
        throw new Error(`Only Video and Photo`);
      }

      let userCheck = await UserModel.findById(user_id);
      let downloads = userCheck.download_content;
      let isExists = downloads.includes(id);
      if (isExists) {
        let findUserById = await UserModel.findById(user_id).populate({
          path: "download_content",
          populate: {
            path: "user",
            select: "username avatar_path chackMark",
          },
        });
        let result = findUserById.download_content.map((content) => {
          return {
            content: {
              _id: content._id,
              title: content.title,
              viewers: content.viewers,
              created_at: content.created_at,
              content_path: content.content_path,
            },
            user: {
              _id: content.user._id,
              username: content.user.username,
              avatar_path: content.user.avatar_path,
            },
          };
        });

        res.send({
          status: 200,
          message: "ok",
          success: true,
          data: result,
        });
      } else {
        let findUserById = await UserModel.findById(user_id).populate({
          path: "download_content",
          populate: {
            path: "user",
            select: "username avatar_path chackMark",
          },
        });
        const newDownload = await UserModel.findByIdAndUpdate(
          user_id,
          {
            $push: { download_content: id },
          },
          {
            new: true,
          }
        );
        let updRes = await UserModel.findById(user_id).populate({
          path: "download_content",
          populate: {
            path: "user",
            select: "username avatar_path chackMark",
          },
        });
        let result = updRes.download_content.map((content) => {
          return {
            content: {
              _id: content._id,
              title: content.title,
              viewers: content.viewers,
              created_at: content.created_at,
              content_path: content.content_path,
            },
            user: {
              _id: content.user._id,
              username: content.user.username,
              avatar_path: content.user.avatar_path,
            },
          };
        });

        res.send({
          status: 200,
          message: "ok downloaded was successfuly!",
          succes: true,
          data: newDownload,
        });
      }
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  // Add Like

  static async addLike(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findById = await ContentModel.findById(id);
      let likesArr = findById.like;

      let isExists = likesArr.includes(user_id);
      if (isExists) {
        const deleted_like = await ContentModel.findByIdAndUpdate(
          id,
          {
            $pull: { like: user_id },
          },
          {
            new: true,
          }
        );
        let deleted_likeU = await UserModel.findByIdAndUpdate(
          user_id,
          { $pull: { liked_content: id } },
          { new: true }
        );
        res.send({
          status: 200,
          message: "ok",
          success: true,
          data: deleted_like.like,
        });
      } else {
        const addedLike = await ContentModel.findByIdAndUpdate(
          id,
          {
            $push: { like: user_id },
          },
          { new: true }
        );
        let findUser = await UserModel.findById(user_id);
        if (!findUser.liked_content.includes(addedLike.like._id)) {
          const addedULike = await UserModel.findByIdAndUpdate(
            user_id,
            {
              $push: { liked_content: id },
            },
            { new: true }
          );
        } else {
          return;
        }

        res.send({
          status: 200,
          message: "ok",
          success: true,
          data: addedLike.like,
        });
      }
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  // Add Dislike 👎

  static async addDisLike(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findById = await ContentModel.findById(id);
      if (findById == null) {
        throw new Error(`Not Found ${id} - content`);
      }
      let disLikeArr = await findById?.dislike;
      let isExists = disLikeArr.includes(user_id);
      if (isExists) {
        const deleted_like = await ContentModel.findByIdAndUpdate(
          id,
          {
            $pull: { dislike: user_id },
          },
          {
            new: true,
          }
        );
        const deletedULike = await UserModel.findByIdAndUpdate(
          user_id,
          {
            $pull: { liked_content: id },
          },
          { new: true }
        );
        res.send({
          status: 201,
          message: "ok",
          success: true,
          data: deleted_like.dislike,
        });
      } else {
        const addedLike = await ContentModel.findByIdAndUpdate(
          id,
          {
            $push: { dislike: user_id },
          },
          { new: true }
        );
        res.send({
          status: 201,
          message: "ok",
          success: true,
          data: addedLike.dislike,
        });
      }
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  // Add Viewers

  static async AddViewers(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findContentById = await ContentModel.findById(id);
      let { viewers } = findContentById;
      let isExists = viewers?.includes(user_id);
      if (!isExists) {
        let viewers = await ContentModel.findById(id).populate("user");
        const addViewers = await ContentModel.findByIdAndUpdate(
          id,
          {
            $push: { viewers: user_id },
          },
          {
            new: true,
          }
        );
        res
          .send({
            status: 200,
            message: `Added Viwer Count`,
            success: true,
            data: viewers.viewers,
          })
          .status(200);
      } else {
        let viewers = await ContentModel.findById(id).populate("user");
        res.send({
          status: 200,
          message: `Viewers Count`,
          success: true,
          data: viewers.viewers,
        });
      }
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  // Delete Methods
  static async DeleteContent(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { id } = req.params;
      let findContentById = await ContentModel.findById(id);
      if (findContentById.user != user_id) {
        throw new Error(
          `you can only delete your ${findContentById.type_content}`
        );
      }
      if (!findContentById) throw new Error(`Not Found ${id} - Content`);
      let deleted_content = await ContentModel.findByIdAndDelete(id);
      if (deleted_content) {
        res.send({
          message: `${id} - ${findContentById.type_content} deleted was successfuly✅`,
          success: true,
          status: 200,
          deleted_content,
        });
      } else
        throw new Error(`Not Deleted ${id} - ${findContentById.type_content}`);
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  static async deleteFromDislike(req, res) {
    let { id } = req.params;
    let { token } = req.headers;
    let { user_id } = VERIFY(token);
    let findContentById = await ContentModel.findById(id);
    let deleted_fromDislike = await ContentModel.findByIdAndUpdate(
      id,
      { $pull: { dislike: user_id } },
      {
        new: true,
      }
    );

    let findContent = await ContentModel.findById(id);
    res.send({
      message: "ok",
      success: true,
      status: 200,
      data: findContent.dislike,
    });
  }

  static async deleteFromLike(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);

      let findContentById = await ContentModel.findById(id);

      let deleted_fromLike = await ContentModel.findByIdAndUpdate(
        id,
        {
          $pull: { like: user_id },
        },
        {
          new: true,
        }
      );
      await UserModel.findByIdAndUpdate(
        user_id,
        {
          $pull: { liked_content: id },
        },
        { new: true }
      );
      let findContent = await ContentModel.findById(id);
      res.send({
        message: "ok",
        success: true,
        status: 200,
        data: findContent.like,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  static async deleteContentFromHistory(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { id } = req.params;
      if (!id) {
        throw new Error(`You must send id from params!`);
      }
      let deletedHistory = await UserModel.findByIdAndUpdate(
        user_id,
        {
          $pull: { history_content: id },
        },
        { new: true }
      );
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: deletedHistory.history_content,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }
  static async deleteContentFromDownloads(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { id } = req.params;
      let deletedDownload = await UserModel.findByIdAndUpdate(user_id, {
        $pull: { download_content: id },
      });
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: deletedDownload.download_content,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  static async clearAllHistories(req, res) {
    console.log(req.url);
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let newHistory = await UserModel.findByIdAndUpdate(
        user_id,
        {
          $set: { history_content: [] },
        },
        {
          new: true,
        }
      );
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: newHistory.history_content,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  static async clearAllLikedContents(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let LikedContents = await UserModel.findByIdAndUpdate(
        user_id,
        {
          $set: { liked_content: [] },
        },
        {
          new: true,
        }
      );
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: LikedContents.liked_content,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  static async clearAllDownloads(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let newDownloads = await UserModel.findByIdAndUpdate(
        user_id,
        {
          $set: { download_content: [] },
        },
        {
          new: true,
        }
      );
      await UserModel.findByIdAndUpdate(
        user_id,
        {
          $set: { download_content: [] },
        },
        { new: true }
      );
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: newDownloads.download_content,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }

  static async deleteContentFromLiked(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { id } = req.params;
      if (!id) {
        throw new Error(`You must send id from params!`);
      }
      let deletedLiked = await UserModel.findByIdAndUpdate(
        user_id,
        {
          $pull: { liked_content: id },
        },
        { new: true }
      );
      await UserModel.findByIdAndUpdate(
        user_id,
        {
          $pull: { liked_content: id },
        },
        { new: true }
      );
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: deletedLiked.liked_content,
      });
    } catch (error) {
      res
        .send({
          message: `Error: ${error.message}`,
          status: 404,
          success: false,
        })
        .status(404);
    }
  }
}
