const io = require('socket.io')(8000, {cors: {origin: "*"}});
const express=require('express');
const serverless=require('serverless-http')
const ServerlessHttp = require('serverless-http');
const app=express();
const router=express.Router();

router.get('/',(req,res)=>{
    res.send("i am fine")
})

const users={};

io.on('connection',socket=>{
   
    // if new user joined let the other users know by broadcasting it
    socket.on('new-user-joined',name=>{
  
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });

    // if someone sends a message , broadcast it to other people

    socket.on('send',message=>{

        socket.broadcast.emit('receive',{
            message:message,name:users[socket.id]
        })
    })

 // if someones leave the chat let the other know
    socket.on('disconnect',message=>{
  
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id]
    })

})

app.use('/.netlify/functions/index',router)
module.exports.handler=serverless(app);