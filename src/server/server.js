import express from "express";
import config from "config";
import colors from "colors";
import cors from "cors";
import router from "../router/index.js";
import "../utils/connection.js";
import {Server} from 'socket.io'

const PORT = config.get("port") || 3000;
const app = express();

app.use(express.json());
app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));
app.use(router);





const server = app.listen(PORT, console.log(`Server running ${PORT}`.blue.bold));




const io = new Server(server)


io.on('connection', socket =>{
    socket.on('setup', (userdata) =>{
        console.log('ulandi');
        socket.join(userdata?._id)
        socket.emit('connected')

        socket.on('join chat', room =>{
            socket.join(room)
            console.log(`User joined Room: ` + room);
        })

        socket.on('typing', room => socket.in(room).emit('typing'));
        socket.on('stop typing', room => socket.in(room).emit('stop typing'));

        socket.on('newMessage', newMessageRecived=>{
            var chat = newMessageRecived.chat;

            if(!chat.users) return console.log('chat.users not defined');

            chat.users.forEach(user =>{
                if(user._id == newMessageRecived.sender._id) return;
                socket.in(user._id).emit('message recived', newMessageRecived)
            })
        })

        socket.off('setup', ()=>{
            console.log('User Disconnect');
            socket.leave(userdata._id)
        })
    })
})