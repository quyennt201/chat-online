import Conversation from "../models/conversation.model.js";

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
    const conversations = await Conversation.find({ members: { $in: [senderId] } });
    return res.json(conversations);
  } catch {
    return res.status(500).json({ message: "An error occur" });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate("members");
    return res.json(conversation);
  } catch {
    return res.status(500).json({ message: "An error occur" });
  }
};
