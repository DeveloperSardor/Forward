import {model, Schema, Types} from 'mongoose';

const ChatSchema = new Schema({
    chatName : {
        type : String,
        trim : true
    },
    isGroupChat : {
        type : Boolean,
        default : false
    },
    users : [{
        type : Types.ObjectId,
        ref : 'users'
    }],
    latestMessage : {
        type : Types.ObjectId,
        ref : 'messages'
    },
    groupAdmin : {
        type : Types.ObjectId,
        ref : 'users'
    }
})

export default model('chats', ChatSchema)