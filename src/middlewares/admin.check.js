import UsersModel from "../modules/users/schema.js";
import { VERIFY } from "../utils/jwt.js";

export const checkAdmin = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      throw new Error(`You have not sent token!`);
    }
    let { user_id } = VERIFY(token);

    if (user_id == "6450e8ca463f262b05068bf3") {
      next();
    } else {
      throw new Error(`You are not admin❌`);
    }
  } catch (error) {
    res.send({ message: error.message, status: 400 }).status(400);
  }
};
