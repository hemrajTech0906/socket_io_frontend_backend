
// import express from 'express'
// import { Server } from "socket.io";
// import { createServer } from "http";
// import cors from "cors";

// const port = 3002;

// const app = express();
// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Allow the client origin
//     methods: ["GET", "post", "put", "delete"], // Allow only these methods from the client
//   },
// });

// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("hello world! TS!");
// });

// io.on("connection", (socket) => {
//   console.log("User is connected ", socket.id);

//   socket.on("message",(data)=>{
//     console.log(data)
//     //io.emit("send-message", data)
//     socket.broadcast.emit("send-message", data)
//   })


//   // data sending from backend to -->frontend

//              //socket.emit("welcome",   `welcome to the server ${socket.id}` )

//   // broadcast 
//   socket.broadcast.emit("welcome",   `New User join  ${socket.id}` )

//   // data receiving from fronted  -->event name "justDo" -->
//   //ofter refresh frontend ->data will receive ofter receicing
//    socket.on("justDo",(x)=>{
//     console.log(x)

//    })

//    socket.on("disconnect",()=>{
//     console.log("user is disconnted ",socket.id)
//    })

// });

// server.listen(port, () => {
//   console.log(`app is running on This ${port}`);
// });





// server.ts
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const port = 3002;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('hello world! TS!');
});

io.on('connection', (socket) => {
  console.log('User is connected ', socket.id);

  socket.on('message', (data) => {
    console.log(data);
    io.emit('send-message', data);
  });

  socket.on('message-to', (data) => {
    const { message, targetSocketID } = data;
    io.to(targetSocketID).emit('send-message', { message, userID: socket.id });
  });

  socket.broadcast.emit('welcome', `New User join  ${socket.id}`);

  socket.on('justDo', (x) => {
    console.log(x);
  });

  socket.on('disconnect', () => {
    console.log('user is disconnected ', socket.id);
  });
});

server.listen(port, () => {
  console.log(`app is running on This ${port}`);
});
