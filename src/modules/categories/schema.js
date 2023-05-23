import { model, Schema, Types } from "mongoose";

const CategorySchema = new Schema({
  category_name: {
    type: String,
    set(value){
        return value.toLowerCase()
    }
  }
});

export default model("categories", CategorySchema);