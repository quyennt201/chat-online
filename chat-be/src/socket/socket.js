import { Server } from "socket.io";

let onlineUsers = [];

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    // add user
    socket.on("addUser", (userId) => {
      const exist = onlineUsers.find((u) => u.userId === userId);

      if (!exist) {
        onlineUsers.push({ userId, socketId: socket.id });
      }

      io.emit("getOnlineUsers", onlineUsers);
    });

    // send message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      console.log(text, senderId, receiverId);
      const user = onlineUsers.find((u) => u.userId === receiverId);
      console.log(user);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      }

      socket.emit("getMessage", {
        senderId,
        text,
      });
    });

    // disconnect
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);

      io.emit("getOnlineUsers", onlineUsers);
    });
  });
};
