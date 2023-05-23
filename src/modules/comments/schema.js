import { model, Schema, Types } from "mongoose";

const CommentsSchema = new Schema({
  body: {
    type: String,
  },
  user: {
    type: Types.ObjectId,
    ref: "users",
  },
  content: {
    type: Types.ObjectId,
    ref: "contents",
  },
  like: [
    {
      type: Types.ObjectId,
      ref: "users",
    },
  ],
  dislike: [
    {
      type: Types.ObjectId,
      ref: "users",
    },
  ],
}, {
  timestamps : true
});

export default model("comments", CommentsSchema);
