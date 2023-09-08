import {createServer} from "http";
import IO from 'socket.io';
import { socketHandler } from './socket';

const httpServer = createServer();
const io = new IO.Server(httpServer, { /* options */ });
io.on("connection", (socket)=>{
  console.log("A connection is connected");
  socketHandler(socket);
});
const port = 8999;
io.listen(port)