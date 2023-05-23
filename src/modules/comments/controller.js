import CommentModel from "./schema.js";
import UserModel from "../../modules/users/schema.js";
import ContentModel from "../../modules/content/schema.js";
import { VERIFY } from "../../utils/jwt.js";

export class CommentController {
  constructor() {}
  //   Get Methods
  static async GetComments(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { content_id } = req.query;
      if (!content_id) {
        throw new Error(`you must send content_id from request query`);
      }
      let findCommentbyContentId = await CommentModel.find({
        content: content_id,
      })
        .sort({ createdAt: -1 })
        .populate("user");

      res.send({
        status: 200,
        message: `${content_id} - comments`,
        success: true,
        data: findCommentbyContentId,
      });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  //  get liked user comment
  static async GetLikedCommentUser(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findByIdComment = await CommentModel.findById(id).populate(
        "like",
        "username avatar_path followers followed checkMark _id"
      );
      if (!findByIdComment) throw new Error(`Not Found ${id} - comment`);
      res.send({
        message: "Liked users",
        status: 200,
        success: true,
        data: findByIdComment,
      });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  //  get disliked user comment

  static async GetDisLikedCommentUser(req, res) {
    try {
      let { id } = req.params;
      let findByIdComment = await CommentModel.findById(id).populate(
        "dislike",
        "username avatar_path followers followed checkMark _id"
      );
      if (!findByIdComment) throw new Error(`Not Found ${id} - comment`);
      res.send({
        message: "Disliked users",
        status: 200,
        success: true,
        data: findByIdComment,
      });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  // Post Methods

  //   --==Add Comment ----===
  static async AddComment(req, res) {
    try {
      let { body, content } = req.body;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      if (!body || !content) throw new Error(` Data is incomplate!`);
      let newComment = CommentModel.create({ body, content, user: user_id });
      let commentUser = await CommentModel.find()
        .sort({ createdAt: -1 })
        .populate("user", "-password");
      if (newComment) {
        res.send({
          message: `Comment Added was successfuly✅`,
          status: 200,
          success: true,
          data: commentUser,
        });
      } else {
        throw new Error(`Not Added Data❌`);
      }
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  // Put Methods
  static async likeTheComment(req, res) {
    try {
      const { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      const findCommentById = await CommentModel.findById(id);
      const likesArr = findCommentById.like;

      let checkIsExists = likesArr.includes(user_id);
      if (checkIsExists) {
        const deleted_like = await CommentModel.findByIdAndUpdate(
          id,
          {
            $pull: {
              like: user_id,
            },
          },
          {
            new: true,
          }
        );
        res.send({
          status: 200,
          message: "ok",
          success: true,
          data: deleted_like.like,
        });
      } else {
        const addedLike = await CommentModel.findByIdAndUpdate(
          id,
          {
            $push: { like: user_id },
          },
          { new: true }
        );
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
          status: 400,
          message: `Error: ${error.message}`,
          success: false,
        })
        .status(400);
    }
  }

  static async DisLikeTheComment(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findComment = await CommentModel.findById(id);
      let dislikeArr = findComment.dislike;
      let isExists = dislikeArr.includes(user_id);
      if (isExists) {
        const deleted_dislike = await CommentModel.findByIdAndUpdate(
          id,
          {
            $pull: { dislike: user_id },
          },
          {
            new: true,
          }
        );
        res.send({
          status: 200,
          message: "ok",
          success: true,
          data: deleted_dislike.dislike,
        });
      } else {
        let added_dislike = await CommentModel.findByIdAndUpdate(
          id,
          {
            $push: { dislike: user_id },
          },
          {
            new: true,
          }
        );
        res.send({
          status: 201,
          message: `ok`,
          success: true,
          data: added_dislike.dislike,
        });
      }
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  // Edit Comment
  static async EditComment(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { body } = req.body;
      if (!body) throw new Error(`You are not sent data from request body❌`);
      let findComment = await CommentModel.findById(id);
      let checkCommentUser = findComment.user == user_id;
      if (checkCommentUser) {
        let updatedComment = await CommentModel.findByIdAndUpdate(
          id,
          {
            $set: { body },
          },
          { new: true }
        );
        res.send({
          status: 200,
          message: `${id} - comment updated was successfuly`,
          success: true,
          data: updatedComment,
        });
      } else {
        throw new Error(`You are only edit your comment😕`);
      }
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  // Delete Method
  static async DeleteComment(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findCommentById = await CommentModel.findById(id);
      if (!findCommentById) throw new Error(`Not Found ${id} - comment ❌`);
      if (findCommentById.user != user_id) {
        throw new Error(`You can deleted only your comment❌`);
      }
      let deletedComm = await CommentModel.findByIdAndDelete(id);
       let newUpdatedComm = await CommentModel.find().populate('user')
       console.log(newUpdatedComm);
      res.send({
        status: 200,
        message: `${id} - comment deleted was successfuly✅`,
        success: true,
        data : newUpdatedComm,
        deleted_com: deletedComm,
      });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  static async deleteFromLike(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findCommById = await CommentModel.findById(id);
      let deleted_fromLike = await CommentModel.findByIdAndUpdate(
        id,
        { $pull: { like: user_id } },
        { new: true }
      );
      let findComm = await CommentModel.findById(id);
      res.send({
        message: "ok",
        success: true,
        status: 200,
        data: findComm.like,
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

  static async deleteFromDislike(req, res) {
    try {
      let { id } = req.params;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let findCommById = await CommentModel.findById(id);
      let deleted_fromDislike = await CommentModel.findByIdAndUpdate(
        id,
        { $pull: { dislike: user_id } },
        { new: true }
      );
      let findComm = await CommentModel.findById(id);
      res.send({
        message: "ok",
        success: true,
        status: 200,
        data: findComm.dislike,
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
}
