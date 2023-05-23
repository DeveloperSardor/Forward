import { SIGN, VERIFY } from "../../utils/jwt.js";
import sendMail from "../../nodemailer/index.js";
import UserModel from "../../modules/users/schema.js";

const confirmCode = Math.floor(Math.random() * 9000 + 1000);
export const Login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      throw new Error(`Data is incomplated`);
    } else {
      let findUser = await UserModel.findOne({ email });
      if (findUser == undefined) {
        throw new Error(`Not Found User`);
      }
      await sendMail(email, confirmCode);
      res
        .send({
          status: 200,
          success : true,
          link: "http://localhost:5000/pass/code",
          message: `We have sent a password to your email.  enter the password🔑`,
          user : findUser,
          token: SIGN({ user_id: findUser._id }),
        })
        .status(200);
    }
  } catch (error) {
    res
      .send({
        status: 401,
        success : false,
        message: `Error: ${error.message}`,
      })
      .status(401);
  }
};

export const PassCode = (req, res) => {
  try {
    let { pass } = req.body;
    console.log(pass, confirmCode);
    if (!pass) {
      throw new Error(`You have sent pass from request body`);
    } else {
      if (pass == confirmCode) {
        console.log('togri ');
        res.send({
          status: 200,
          message: `Success`,
          success: true,
        });
      } else {
        throw new Error(`Invalid pass`);
      }
    }
  } catch (error) {
    res
      .send({
        status: 400,
        success : false,
        message: `Error: ${error.message}`,
      })
      .status(400);  
  }
};
