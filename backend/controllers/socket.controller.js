import Profile from "../models/profile.model.js";
import Message from "../models/message.model.js";

const activeConnections = new Map();

class SocketConnection {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.userId = null;

    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleMessages = this.handleMessages.bind(this);
  }

  async handleConnection() {
    const user = await Profile.findOne({ userId: this.socket.user.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    this.userId = user._id.toString();
    
    activeConnections.set(this.userId, this.socket.id);

    this.socket.on("disconnect", this.handleDisconnect);

    this.socket.on("sendMessage", this.handleMessages);
  }

  handleDisconnect() {
    const userId = this.userId;
    activeConnections.delete(userId);
  }

  async handleMessages(data, callback) {
    const { text, recipientId } = data;

    const senderId = this.userId;

    try {
      const message = new Message({
        senderId,
        recipientId,
        text,
      });

      await message.save();

      const recipientSocketId = activeConnections.get(recipientId);
      if (recipientSocketId) {
        this.io.to(recipientSocketId).emit("newMessage", {
          senderId,
          recipientId,
          text,
          timestamp: new Date(),
        });
      } else {
        console.log("Recipient is not connected");
      }

      const senderSocketId = activeConnections.get(senderId);
      if (senderSocketId) {
        this.io.to(senderSocketId).emit("newMessage", {
          senderId,
          recipientId,
          text,
          timestamp: new Date(),
        });
      } else {
        console.log("Sender is not connected");
      }

      callback({ status: "success", message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      callback({ status: "error", message: "Failed to send message" });
    }
  }
}

export default SocketConnection;