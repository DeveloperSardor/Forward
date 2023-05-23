import ChatModel from "./schema.js";
import UserModel from "../../modules/users/schema.js";
import { VERIFY } from "../../utils/jwt.js";

export class ChatController {
  constructor() {}
  static async accessChat(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { userId } = req.body;
      if (!user_id) throw new Error(`userId param not sent with request`);
      var isChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: user_id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");
      isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "username avatar_path email",
      });
      if (isChat.length > 0) {
        res.send({
          status: 200,
          message: "ok",
          success: true,
          data: isChat[0],
        });
      } else {
        var chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [user_id, userId],
        };
      }

      const createdChat = await ChatModel.create(chatData);
      const FullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: FullChat,
      });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  static async fetchChats(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      ChatModel.find({ users: { $elemMatch: { $eq: user_id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .then(async (results) => {
          results = await UserModel.populate(results, {
            path: "latestMessage.sender",
            select: "username email avatar_path",
          });
          res.status(200).send({
            status: 200,
            message: "ok",
            success: true,
            data: results,
          });
        });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  static async createGroupChat(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { chatName, users } = req.body;
      if (!chatName || !users) throw new Error(`Please fill the field`);
      users = JSON.parse(users);
      if (users.length < 1) {
        throw new Error("More Than 2 users are required to form a group chat");
      }
      users.push(user_id);
      const groupChat = await ChatModel.create({
        chatName: chatName,
        users: users,
        isGroupChat: true,
        groupAdmin: user_id,
      });
      const fullGroupChat = await ChatModel.findById(groupChat._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).send({
        status: 200,
        message: "ok",
        success: true,
        data: fullGroupChat,
      });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  static async renameGroup(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      const { chatName } = req.body;
      const { chatId } = req.params;
      const updatedChat = await ChatModel.findByIdAndUpdate(
        chatId,
        {
          chatName,
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (!updatedChat) {
        throw new Error(`Chat Not Found`);
      } else {
        res.send({
          status: 200,
          message: "ok",
          success: true,
          data: updatedChat,
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

  static async addToGroup(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      const { userId, chatId } = req.body;
      if (!userId || !chatId) {
        throw new Error(`data is incomplated ❌`);
      }
      const added = await ChatModel.findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (!added) {
        throw new Error("Chat Not Found");
      } else {
        res.send({
          status: 200,
          message: "ok",
          success: true,
          data: added,
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

  static async removeFromGroup(req, res) {
    try {
      let { userId, chatId } = req.body;
      const removed = await ChatModel.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (!removed) {
        throw new Error("Chat Not Found");
      } else {
        res.send({
          status: 200,
          message: "ok",
          success: true,
          data: removed,
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
}
