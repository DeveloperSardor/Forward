import UserModel from "../../modules/users/schema.js";
import ContentModel from "../../modules/content/schema.js";
import { VERIFY } from "../../utils/jwt.js";

export class UserController {
  constructor() {}

  //  Get Methods

  static async SearchUserForChats(req, res) {
    try {
      const { search } = req.query;
      const keyword = search
        ? {
            $or: [
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const users = await UserModel.find(keyword);
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: users,
      });
    } catch (error) {
      res
        .send({
          status: 404,
          message: `Error: ${error.message}`,
          success: false,
        })
        .status(404);
    }
  }


  static async GetUsers(req, res){
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let {id} = req.params;
      if(id){
        let findById = await UserModel.findById(id);
        res.send({
          status : 200,
          message : 'ok',
          success : true,
          data : findById
        })
      }else{
        res.send({
          status : 200,
          message : 'ok',
          success : true,
          data : await UserModel.find()
        })
      }
    } catch (error) {
      res
      .send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      })
      .status(404);
    }
  }

  static async GetProfileUser(req, res) {
    try {
      let { id } = req.params;
      let { username } = req.query;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      if (id) {
        let findUserById = await ContentModel.find()
          .populate("user")
          .where({ user: id });

        let user = await UserModel.findById(id).select(
          "-download_content -__v"
        );

        let content = findUserById.map((el) => {
          return {
            content: {
              _id: el._id,
              title: el.title,
              content_path: el.content_path,
              type_content: el.type_content,
              description: el.description,
              viewers: el.viewers,
              created_at: el.created_at,
            },
            user,
          };
        });
        res.send({
          status: 200,
          message: `User Profile`,
          success: true,
          data: content.map((el) => el.content),
          user: content[0].user,
        });
      } else if (username) {
        let allUser = await UserModel.find();
        let findByUsername = allUser.find(
          (el) => el.username.replace(/ /g, "") == username
        );
        let findUserById = await ContentModel.find({
          user: findByUsername._id,
        }).populate("user");

        let user = await UserModel.findById(findByUsername._id).select(
          "-download_content -__v"
        );

        if (findUserById.length) {
          let content = findUserById.map((el) => {
            return {
              content: {
                _id: el._id,
                title: el.title,
                content_path: el.content_path,
                viewers: el.viewers,
                description: el.description,
                created_at: el.created_at,
                type_content: el.type_content,
              },
              user,
            };
          });
          res.send({
            status: 200,
            message: `User Profile`,
            success: true,
            data: content.map((el) => el.content),
            user: content[0].user,
          });
        } else {
          res.send({
            status: 200,
            mesage: "ok",
            success: true,
            data: [],
            user,
          });
        }
      }
    } catch (error) {
      res
        .send({
          status: 404,
          message: `Error: ${error.message}`,
          success: false,
        })
        .status(404);
    }
  }

  static async GetFollowers(req, res) {
    try {
      let { id } = req.params;
      let findFollowers = await UserModel.findById(id).populate("followers");
      if (!findFollowers.followers.length ) {
        res.send({
          status: 200,
          success: true,
          message: `No followers yet`,
          data: findFollowers.followers,
        });
      } else {
        res.send({
          status: 200,
          success: true,
          message: `Followers`,
          data: findFollowers.followers,
        });
      }
    } catch (error) {
      res.send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  static async GetFollowed(req, res) {
    try {
      let { id } = req.params;
      let findFollowed = await UserModel.findById(id).populate("followed");
      if (!findFollowed.followed?.length) {
        res.send({
          status: 200,
          success: true,
          message: `No followed yet`,
          data: findFollowed.followed,
        });
      } else {
        res.send({
          status: 200,
          success: true,
          message: `followed`,
          data: findFollowed.followed,
        });
      }
    } catch (error) {
      res.send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }





  // Post Methods



  static async addBirthDate(req, res){
    try{
      let {token} = req.headers;
      let {user_id} = VERIFY(token);
      let {birth_date} = req.body;
      if(!birth_date){
        throw new Error(`Uncompaled data!`)
      }
      let updatedUser = await UserModel.findByIdAndUpdate(user_id, {birth_date})
      res.send({
        status : 200,
        message : 'Birthdate added',
        success : true,
        data : updatedUser
      })

    }catch(err){
      res.send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }




  // Put Methods

  static async toSubscribe(req, res) {
    try {
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      let { id } = req.params;
      let find = await UserModel.findById(id);
      if (find._id == user_id) {
        throw new Error(`You cannot subscribe to yourself ❌`);
      }
      if (find.followers.includes(user_id)) {
        let unsubscribe = await UserModel.findByIdAndUpdate(
          id,
          {
            $pull: { followers: user_id },
          },
          { new: true }
        );
        await UserModel.findByIdAndUpdate(
          user_id,
          { $pull: { followed: id } },
          { new: true }
        );
        res.send({
          status: 200,
          message: `Unsubscribe ✅`,
          success: true,
          data: unsubscribe.followers,
        });
      } else {
        let subscribe = await UserModel.findByIdAndUpdate(
          id,
          {
            $push: { followers: user_id },
          },
          { new: true }
        );
        await UserModel.findByIdAndUpdate(
          user_id,
          { $push: { followed: id } },
          { new: true }
        );
        res.send({
          status: 200,
          message: `You have successfully subscribed✅`,
          success: true,
          data: subscribe.followers,
        });
      }
    } catch (error) {
      res.send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }


  static async EditProfile(req, res){
    try {
      let {token} = req.headers;
      let {user_id} = VERIFY(token);
      let {firstname, lastname, username, gender, email, password, info, avatar_path} = req.body;
      if(!firstname && !lastname && username && !gender && !email && !password && !info && !avatar_path){
        throw new Error(`You are not sent data from request body!`)
      }
      let newUpdatedUser = await UserModel.findByIdAndUpdate(user_id, {firstname, lastname, username, gender, email, password, info, avatar_path}, {new : true})
      res.send({
        status : 200,
        message : "OK Updated ✅",
        success : true,
        data : newUpdatedUser
      })
    } catch (error) {
      res.send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  static async AdminGiveCheckMark(req, res) {
    try {
      let { user__id } = req.params;
      let { username } = req.query;
      let { token } = req.headers;
      let { user_id } = VERIFY(token);
      if (user__id) {
        let findUserById = await UserModel.findById(user__id);
        if (!findUserById) throw new Error(`Not Found ${user__id} - user ❌`);
        let updatedUser = await UserModel.findByIdAndUpdate(user__id, {
          $set: { checkMark: true },
        });
        res.send({
          status: 200,
          message: `Ok you are giving checkMark  : ${user__id} - user`,
          success: true,
          data: updatedUser,
        });
      } else if (username) {
        let findUserByUsername = await UserModel.findOne({ username });
        if (!findUserByUsername) {
          throw new Error(`Not Found ${username} - user ❌`);
        }
        let updatedUser = await UserModel.updateOne(
          { username },
          { $set: { checkMark: true } }
        );
        res.send({
          status: 200,
          message: `Ok you are giving checkMark  : ${username} - user`,
          success: true,
          data: updatedUser,
        });
      }
    } catch (error) {
      res
        .send({
          message: `Error: ${error.mesage}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  static async adminDeleteUser(req, res) {
    try {
      let { id } = req.params;
      let deleted_user = await UserModel.findByIdAndDelete(id);
      if (deleted_user) {
        res.send({
          status: 200,
          message: "Ok Deleted",
          success: true,
          data: await deleted_user,
        });
      } else {
        throw new Error(`Not Deleted! `);
      }
    } catch (error) {
      res
        .send({
          message: `Error: ${error.mesage}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }

  static async deleteFromFollowed(req, res) {
    try {
      let { token } = req.headers;
      let { id } = req.params;
      let { user_id } = VERIFY(token);
      let check = await UserModel.findById(id);
      if (!check) {
        throw new Error(`Not Found ${id} - user!`);
      }
      let deleteFollowed = await UserModel.findByIdAndUpdate(user_id, {
        $pull: { followed: id },
      });
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: deleteFollowed,
      });
      await UserModel.findByIdAndUpdate(
        id,
        { $pull: { followers: user_id } },
        { new: true }
      );
    } catch (error) {
      res
        .send({
          message: `Error: ${error.mesage}`,
          status: 400,
          success: false,
        })
        .status(400);
    }
  }
}
