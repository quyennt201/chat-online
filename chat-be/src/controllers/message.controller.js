import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user?.userId;

    if (!conversationId || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const message = await Message.create({
      conversationId: conversationId,
      senderId: senderId,
      text: text,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
    });

    res.status(201).json(message);
  } catch {
    res.status(500).json({ message: "An error occur" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversationId: conversationId,
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch {
    res.status(500).json({ message: "An error occur" });
  }
};
