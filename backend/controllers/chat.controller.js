import Profile from "../models/profile.model.js";
import Message from "../models/message.model.js";

export const getChatHistory = async (req, res) => {
  const { recipientId } = req.params;

  const sender = await Profile.findOne({ userId: req.user.userId });
  if (!sender) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const senderId = sender._id.toString();

  try {
    const messages = await Message.find({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    }).sort({ timestamp: 1 });

    const recipient = await Profile.findOne({ _id: recipientId });

    res.status(200).json({recipient ,messages});
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};