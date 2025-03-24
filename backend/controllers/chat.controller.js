import Profile from "../models/profile.model.js";
import Message from "../models/message.model.js";

export const getChatHistory = async (req, res) => {
  const { recipientId } = req.params;
  const { oldestMessageTimestamp } = req.body;
  const MESSAGE_LIMIT = 20;

  const sender = await Profile.findOne({ userId: req.user.userId });
  if (!sender) {
    return res.status(404).json({ message: "User not found" });
  }

  const senderId = sender._id.toString();

  try {
    let query = {
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    };

    if (oldestMessageTimestamp) {
      query.timestamp = { $lt: new Date(oldestMessageTimestamp) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(MESSAGE_LIMIT);

    const recipient = await Profile.findOne({ _id: recipientId });

    res.status(200).json({ recipient, messages: messages.reverse() });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};