"use strict";
// import {WebSocketServer, WebSocket} from "ws";
Object.defineProperty(exports, "__esModule", { value: true });
// const wss = new WebSocketServer ({port:8080});
// interface User{
//     socket:WebSocket;
//     room: string;    
// }
// let allSockets: User[] = [ ];
// wss.on("connection", (socket)=> {
//     socket.on("message",(message) => {
//         const parsedMessage = JSON.parse(message as unknown as string);
//         if (parsedMessage.type === "join"){
//             allSockets.push({
//                 socket,
//                 room : parsedMessage.payload.roomId
//             })
//         }
//         if (parsedMessage.type == "chat"){
//             let currentUserRoom = null;
//                for(let i =0; i < allSockets.length; i++){
//                 if(allSockets[i].socket == socket){
//                     currentUserRoom = allSockets[i].room
//                 }
//             }
//             for (let i = 0; i < allSockets.length; i++){
//                 if(allSockets[i].room == currentUserRoom){
//                     allSockets[i].socket.send(parsedMessage.payload.message)
//                 }
//             }
//         }
//     })
// })
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        try {
            const messageStr = message.toString().trim();
            console.log("Received raw message:", messageStr);
            const parsedMessage = JSON.parse(messageStr);
            if (!parsedMessage.type || !parsedMessage.payload) {
                console.error("Missing type or payload:", parsedMessage);
                socket.send(JSON.stringify({ error: "Invalid message format" }));
                return;
            }
            if (parsedMessage.type === "join" && parsedMessage.payload.roomId) {
                console.log(`User joined room: ${parsedMessage.payload.roomId}`);
                allSockets.push({ socket, room: parsedMessage.payload.roomId });
                return;
            }
            if (parsedMessage.type === "chat" && parsedMessage.payload.message) {
                console.log(`User wants to chat in room: ${parsedMessage.payload.roomId}`);
                const currentUser = allSockets.find(user => user.socket === socket);
                if (!currentUser)
                    return;
                allSockets.forEach(user => {
                    if (user.room === currentUser.room) {
                        user.socket.send(parsedMessage.payload.message);
                    }
                });
            }
        }
        catch (error) {
            console.error("Invalid message format:", error);
            socket.send(JSON.stringify({ error: "Invalid JSON format" }));
        }
    });
});
