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
    // console.log("User connected:", this.userId);

    activeConnections.set(this.userId, this.socket.id);
    // console.log("Active connections:", activeConnections);

    this.socket.on("disconnect", this.handleDisconnect);

    this.socket.on("sendMessage", this.handleMessages);
  }

  handleDisconnect() {
    const userId = this.userId;
    // console.log("User disconnected:", userId);

    activeConnections.delete(userId);
    // console.log("Active connections:", activeConnections);
  }

  async handleMessages(data, callback) {
    const { text, recipientId } = data;

    // console.log("Recipient ID:", recipientId);

    const senderId = this.userId;

    try {
      // Save the message to the database
      const message = new Message({
        senderId,
        recipientId,
        text,
      });

      await message.save();
      // console.log("Message saved to the database");

      const recipientSocketId = activeConnections.get(recipientId);
      // console.log("Recipient socket ID:", recipientSocketId);

      if (recipientSocketId) {
        this.io.to(recipientSocketId).emit("newMessage", {
          senderId,
          recipientId,
          text,
          timestamp: new Date(),
        });
        // console.log("Emitting message to recipient:", recipientSocketId);
      } else {
        console.log("Recipient is not connected");
      }

      const senderSocketId = activeConnections.get(senderId);
      // console.log("Sender socket ID:", senderSocketId);

      if (senderSocketId) {
        this.io.to(senderSocketId).emit("newMessage", {
          senderId,
          recipientId,
          text,
          timestamp: new Date(),
        });
        // console.log("Emitting message to sender:", senderSocketId);
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