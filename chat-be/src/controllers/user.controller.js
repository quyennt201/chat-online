import User from "../models/user.model.js";

export const getUsersController = async (req, res) => {
  try {
        const userIdsString = req.query?.ids 
        const userIds = userIdsString?.split(",")?.map((id) => id?.trim()) || []

        if(!userIds.length) {
            const users = await User.find().lean();
            return res.status(200).json(users.filter((user) => user._id.toString() !== req.user?.userId));
        }

        const users = await User.find({_id: {$in: userIds}}).lean();
        res.status(200).json(users.filter((user) => user._id.toString() !== req.user?.userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMeController = async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "An error occur" });
  }
};

export const getUserByIdsController = async (req, res) => {
    try {
        const userIdsString = req.query?.ids 
        const userIds = userIdsString.split(",")?.map((id) => id.trim()) || []

        if(!userIds.length) {
            return res.status(400).json({ message: "No user ids provided" });
        }

        const users = await User.find({_id: {$in: userIds}}).lean().select("-password") || [];

        res.status(200).json(users);
    } catch {
        res.status(500).json({ message: "An error occur" });
    }
}

export const updateMeController = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.user?.userId, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        });
    } catch {
      res.status(500).json({ message: "An error occur" });
    }
  };