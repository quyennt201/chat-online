import { Server } from "socket.io";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { sendMessage } from "../controllers/message.controller.js";

let onlineUsers = [];

export const addUser = (userId, socketId) => {
  const exist = onlineUsers.find((u) => u.userId === userId);

  if (!exist) {
    onlineUsers.push({ userId, socketId });
  }
};

export const getUser = (userId) => {
  console.log("userId");
  return onlineUsers.find((u) => u.userId === userId);
};

export const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
};

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    // add user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);

      io.emit("getOnlineUsers", onlineUsers);
    });

    // send message
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
        const conversation = await Conversation.findOne({
          members: { $all: [senderId, receiverId] },
        });

        console.log(conversation);

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
      removeUser(socket.id);

      io.emit("getOnlineUsers", onlineUsers);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket chưa được init");
  }
  return io;
};
