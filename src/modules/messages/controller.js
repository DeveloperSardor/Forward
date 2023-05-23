import MessagesModel from './schema.js'
import UsersModel from '../../modules/users/schema.js'
import ChatModel from '../../modules/chat/schema.js'
import { VERIFY } from '../../utils/jwt.js';

export class MessageController {
    constructor(){}
    static async sendMessage (req, res){
        try {
            let {token} = req.headers;
            let {user_id} = VERIFY(token)
            let {content, chatId} = req.body;
            if(!content || !chatId){
                throw new Error(`Data is incomplated`)
            }
            var newMessage = {
                sender : user_id,
                content ,
                chat : chatId
            }
            var message = await MessagesModel.create(newMessage);
            message = await message.populate('sender', 'username avatar_path')
            message = await message.populate('chat')
            message = await UsersModel.populate(message, {
                path : 'chat.users',
                select : 'username email avatar_path'
            })
            await ChatModel.findByIdAndUpdate(chatId, {
                latestMessage : message
            })
            res.send({
                status : 200,
                message : 'ok',
                success : true,
                data : message
            })
        } catch (error) {
            res.send({
                status : 400,
                message : `Error: ${error.message}`,
                success : false
            })
        }
    }


    static async allMessages (req, res){
        try {
            let {chatId} = req.params;
            const messages = await MessagesModel.find({chat :chatId}).populate(
                'sender',
                'username avatar_path email'
            ).populate('chat')
            res.send({
                status : 200,
                message : 'ok',
                success : true,
                data : messages
            })
        } catch (error) {
            res.send({
                status : 400,
                message : `Error: ${error.message}`,
                success : false
            })
        }
    }
}
