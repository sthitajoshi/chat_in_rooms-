import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

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
                if (!currentUser) return;

                allSockets.forEach(user => {
                    if (user.room === currentUser.room) {
                        user.socket.send(parsedMessage.payload.message);
                    }
                });
            }
        } catch (error) {
            console.error("Invalid message format:", error);
            socket.send(JSON.stringify({ error: "Invalid JSON format" }));
        }
    });
});
