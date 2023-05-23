import { model, Schema, Types } from "mongoose";

const ContentSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    trim: true,
  },
  viewers: [
    {
      type: Types.ObjectId,
      ref: "users",
    },
  ],
  content_path: {
    type: String,
  },
  type_content: {
    type: String,
    enum: {
      values: ["story", "video", "photo"],
      message: "You must enter Story or Video or Photo!",
    },
  },
  description: {
    type: String || null,
  },
  category_content: {
    type: Types.ObjectId,
    ref: "categories",
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


},{
  timestamps : {
    createdAt : 'created_at'
  }
} );

ContentSchema.index({ title: "text" });

export default model("contents", ContentSchema);
 