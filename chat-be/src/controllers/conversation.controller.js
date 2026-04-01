import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getIO, getUser } from "../socket/socket.js";

export const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user?.userId;

    const existing = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existing) {
      return res.json(existing);
    }

    const newConversation = await Conversation.create({
      members: [senderId, receiverId],
    });

    return res.status(201).json(newConversation);
  } catch {
    return res.status(500).json({ message: "An error occur" });
  }
};

export const getConversationsMe = async (req, res) => {
  try {
    const senderId = req.user?.userId;
    const conversations = await Conversation.find({
      members: { $in: [senderId] },
    });
    return res.json(conversations);
  } catch {
    return res.status(500).json({ message: "An error occur" });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId)
      .populate("members")
      .populate("messages");
    return res.json(conversation);
  } catch {
    return res.status(500).json({ message: "An error occur" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const senderId = req.user?.userId;

    if (!conversationId || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const message = await Message.create({
      conversationId: conversationId,
      senderId: senderId,
      text: text,
    });
    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
    });

    conversation.messages.push(message._id);

    conversation.lastMessage = text;
    await conversation.save();

    const io = getIO();

    const receiverId = conversation.members.find(
      (m) => m.toString() !== senderId.toString(),
    );

    const receiver = getUser(receiverId.toString());
    const messageData = {
      _id: message._id,
      conversationId,
      senderId,
      text,
      createdAt: message.createdAt,
    };
    console.log(receiverId.toString(), receiver);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", messageData);
    }

    res.status(201).json(messageData);
  } catch {
    res.status(500).json({ message: "An error occur" });
  }
};
