const express = require('express');
const path = require('path')
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessages,generateLocationMessages} = require('../src/utils/messages');
const {addUser,removeUser,getUser,getsUserInRoom} = require('./utils/users');

const app = express();

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'../public');
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    
    socket.on('join',({username,room},callback)=>{
        
        const {error,user} = addUser({id : socket.id,username,room});

        if(!user){
            return callback(error)
        }

        socket.join(user.room);

        socket.emit('message',generateMessages('Admin',"Welcome!"));
        socket.broadcast.to(user.room).emit('message',generateMessages('Admin',`${user.username} has joined room !`));
        console.log('before');
        io.to(user.room).emit('roomData',{
            room : user.room,
            users : getsUserInRoom(user.room)
        });
        console.log('after');

        callback();
    });


    socket.on('sendMessage',(msg,callback) => {
        
        const user = getUser(socket.id);

        if(!user){
            return callback(user)
        }
        //console.log(user);
        const filter =new Filter();
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed');
        }
        io.to(user.room).emit('message',generateMessages(user.username,msg));
        callback();
    });

    socket.on('sendLocation',(location,callback) => {
        const user = getUser(socket.id);

        if(!user){
            return callback(user)
        }

        io.to(user.room).emit('locationMessage',generateLocationMessages(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback();
    });

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message',generateMessages('Admin',`${user.username} has left`));

            io.to(user.room).emit('roomData',{
                room : user.room,
                users : getsUserInRoom(user.room)
            });
        }
    });
    
    // socket.on('increment',()=>{
    //     count++;
    //     io.emit('countUpdated',count);
    // });
});

server.listen(PORT,()=>{
    console.log('Server is up and running on port ',PORT);
});

window.addEventListener("message", function(e) { 
   alert(e.data.toString());
});

window.parent.postMessage("Hello world.", "*");
window.parent.postMessage("Hello world.", "*");
window.parent.postMessage("Hello world.", "*");


let untrusted_ajax_res = document.write(location.replace("https://www.w3schools.com"));
document.getElementById("temp").innerHTML=untrusted_ajax_res;

var regex = new RegExp(currentUnit+'\.'+currentWeek+'\.'+currentBookType);
if(!k.match(regex))	{				
								if (typeof val == "string" && val.match(/\d*\|\d*/)) {
									prevWeekWordCount += parseInt(val.split("|")[0]);  // calculate previous weeks word count
								}
							}
   
