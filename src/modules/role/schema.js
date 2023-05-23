import { model, Schema, Types } from "mongoose";

const RoleSchema = new Schema(
  {
    role: {
      type: String,
      require: true,
    }
  },
  {
    timestamps: false,
  }
); 

export default model("roles", RoleSchema);