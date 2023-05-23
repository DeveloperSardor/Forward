import { Router } from "express";
import { checkAdmin } from "../../middlewares/admin.check.js";
import { checkToken } from "../../middlewares/token.check.js";
import { UserController } from "./controller.js";

const UserRouter = Router();

// Get Methods
UserRouter.get(
  "/channel/:id",
  checkToken,
  UserController.GetProfileUser
);
UserRouter.get(
  "/channel",
  checkToken,
  UserController.GetProfileUser
);

UserRouter.get(
  '/users',
  checkToken,
  UserController.GetUsers
)
UserRouter.get(
  '/users/:id',
  checkToken,
  UserController.GetUsers
)

UserRouter.get("/users/search", checkToken, UserController.SearchUserForChats);

// Get Followers
UserRouter.get("/followers/:id", checkToken, UserController.GetFollowers);

// Get Followed
UserRouter.get("/followed/:id", checkToken, UserController.GetFollowed);



// Post Methods

UserRouter.post('/add/birthdate', checkToken, UserController.addBirthDate)

// Put Methods
UserRouter.put(
  "/subscribe/channel/:id",
  checkToken,
  UserController.toSubscribe
);

UserRouter.put(
  '/profile/edit',
  checkToken,
  UserController.EditProfile
)

UserRouter.put(
  "/admin/givecheckmark/:user__id",
  checkAdmin,
  UserController.AdminGiveCheckMark
);



UserRouter.delete(
  '/followed/:id',
  checkToken,
  UserController.deleteFromFollowed 
)


export default UserRouter;
