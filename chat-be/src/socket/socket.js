import { Server } from "socket.io";
import Conversation from "../models/conversation.model.js";

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
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
        const conversation = await Conversation.findOne({
          members: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
          return;
        }

        const user = onlineUsers.find((u) => u.userId === receiverId);

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
      } catch {
        //
      }
    });

    // disconnect
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);

      io.emit("getOnlineUsers", onlineUsers);
    });
  });
};
