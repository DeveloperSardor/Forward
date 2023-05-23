import UsersModel from "../../modules/users/schema.js";
import RoleModel from "../../modules/role/schema.js";
import { SIGN } from "../../utils/jwt.js";
import sendMail from "../../nodemailer/index.js";



export const Register = async (req, res) => {
  try {
    let {
      firstname,
      lastname,
      username,
      gender,
      email,
      password,
      avatar_path,
    } = req.body;
    console.log(req.body);
    if (
      !firstname ||
      !lastname ||
      !username ||
      !gender ||
      !email ||
      !password
    ) {
      throw new Error(`Data is is incomplete❌`);
    } else {
      let newUser = await UsersModel.create({
        firstname,
        lastname,
        username,
        gender,
        email,
        password,
        avatar_path: avatar_path 
          ? avatar_path
          : gender == "male"
          ? "https://yt3.ggpht.com/a/AGF-l78AzseOtv4fYGdmRtS7CtaL4wJZLKuFwsi54g=s900-c-k-c0xffffffff-no-rj-mo"
          : gender == "female"
          ? "https://cdn4.iconfinder.com/data/icons/business-conceptual-part1-1/513/employee-1024.png"
          : null,
        role: "6450129ecac50ca065c059ac",
      });

      if ((await newUser) == undefined) {
        throw new Error(`User not added ❌`);
      } 
        res
          .send({
            status: 201,
            message: "Registration was successfuly",
            success: true,
            token: SIGN({ user_id: await newUser._id }),
            added_user: await newUser,
          })
          .status(201);
 
    }
  } catch (error) {
    res.send({ message: `Error : ${error.message}`, status: 401, success : false }).status(401);
  }
};
