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
