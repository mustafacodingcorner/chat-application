const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const formatMessage = require('./utilis/messages');
const {userJoin , getCurrentUser , userLeave ,  getRoomUsers } = require('./utilis/users');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const CHAT_BOT = "روبوت الدردشة";

app.use(express.static(path.join(__dirname , 'public')))
io.on('connection' , socket => {
    socket.on('joinRoom' , (joinedUser) => {
        joinedUser.id = socket.id;
        const user =  userJoin(joinedUser);
        socket.join(user.room);
        socket.emit("message",formatMessage(CHAT_BOT , "اهلا بك فى دردشة"));
        socket.broadcast.to(user.room).emit("message" , formatMessage(CHAT_BOT ,`انضم ${user.username} إلى الدردشة`));

        io.to(user.room).emit("roomUsers" , {
            room : user.room,
            users:getRoomUsers(user.room)
        });
    })
    
    socket.on("chatMessage" , (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message" , formatMessage(user.username,msg));
    });

    socket.on('disconnect' , () => {
        const user = userLeave(socket.id); 
        if(user){
            io.to(user.room).emit("message",formatMessage( CHAT_BOT,`${user.username} قد غادر غرفة الدردشة`))
            io.to(user.room).emit("roomUsers" , {
                room : user.room,
                users:getRoomUsers(user.room)
            });
        }
        
    });
})

const PORT = process.env.PORT || 3000 ;

server.listen(PORT , () => { console.log(`Server is running on port ${PORT}`)})