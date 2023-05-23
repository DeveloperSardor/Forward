import { model, Schema, Types } from "mongoose";

const MessageSchema = new Schema({
  sender: {
    type: Types.ObjectId,
    ref: "users",
  },
  content: {
    type: String,
    trim: true,
  },
  chat: {
    type: Types.ObjectId,
    ref: "chats",
  },
}, {
  timestamps : true
});


export default model('messages', MessageSchema)