import { model, Schema, Types } from "mongoose";

const UsersSchema = new Schema({
  firstname: {
    type: String,
    require: true,
    maxLength: 25,
    minLength: 3,
    set(value) {
      if (value?.length > 25 || value?.length < 3) {
        throw new Error(`Invalid firstname length`);
      }
      return value;
    },
  },
  lastname: {
    type: String,
    require: true,
    maxLength: 25,
    set(value) {
      if (value?.length > 25 || value?.length < 3) {
        throw new Error(`Invalid lastname length`);
      }
      return value;
    },
  },
  username: {
    type: String,
    require: true,
    unique: true,
    maxLength: 30,
    set(value) {
      if (value?.length > 25 || value?.length < 3) {
        throw new Error(`Invalid username length`);
      }
      return value;
    },
  },
  role: {
    type: Types.ObjectId,
    ref: "roles",
  },
  avatar_path: {
    type: String,
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female"],
      message: "You must enter male or female!",
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    set(email) {
      if (
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
          email
        )
      )
        return email;
      throw new Error(`Invalid email❌`);
    },
  },
  password: {
    type: String,
    minLength: 3,
    set(value) {
      if (value?.length < 3) {
        throw new Error(`Invalid length password`);
      }
      return value;
    },
  },
  followers: [
    {
      ref: "users",
      type: Types.ObjectId,
    },
  ],
  followed: [
    {
      ref: "users",
      type: Types.ObjectId,
    }, 
  ],
  birth_date : {
    type : Date,
    default : null
  },
  info: {
    type: String,
  },
  checkMark: {
    type: Boolean,
    default: false,
  },
  download_content: [
    {
      type: Types.ObjectId,
      ref: "contents",
    },
  ],
  history_content: [
    {
      type: Types.ObjectId,
      ref: "contents",
    },
  ],
  liked_content: [
    {
      type: Types.ObjectId,
      ref: "contents",
    },
  ],
});

export default model("users", UsersSchema);
