const http=require("http")
const express=require("express")
const app=express();
const socketIO=require("socket.io")
const cors=require("cors");

const users=[]

app.use(cors);
app.get("/",(req,res)=>{
    console.log("home page ")
})

const server=http.createServer(app);
const io=socketIO(server);

io.on("connection",(socket)=>{
    console.log("New connection") 
    
    socket.on('joined',(data)=>{
        users[socket.id]=data.user;
        console.log(`${data.user} has joined`)
        console.log(socket.id)
        console.log(users)
        socket.broadcast.emit('userjoined',{user:"Admin",message:`${users[socket.id]} has joined `});
        socket.emit('welcome',{user:"Admin",message:`${users[socket.id]} welcome to the chat`})
        
    })
    
    
    socket.on('message',(data)=>{
        io.emit('sendMessage',{user:users[data.id],message:data.message})
    })

    socket.on('disconnected',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`})
        console.log("user left")
    })
    
})

server.listen(process.env.PORT|| 4500  ,()=>{
    console.log("server is running on http://loaclhost:4500")
})    
 