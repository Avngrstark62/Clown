import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSocket } from "../api/socket.js";
import { useParams } from "react-router-dom";
import { getChatHistory } from "../api/api";

const ChatComponent = () => {
  const { recipientId } = useParams();
  const isInitialized = useSelector((state) => state.socket.isInitialized);
  const socket = getSocket();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [recipient, setRecipient] = useState(null);
  const { user } = useSelector((state) => state.auth); // Get current user

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await getChatHistory(recipientId);
        setMessages(response.data.messages);
        setRecipient(response.data.recipient);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [recipientId]);

  useEffect(() => {
    if (isInitialized && socket) {
      socket.on("newMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [isInitialized, socket]);

  const sendMessage = () => {
    if (socket && messageInput.trim() !== "") {
      const text = messageInput;
      socket.emit("sendMessage", { recipientId, text }, (response) => {
        if (response.status !== "error") {
          // setMessages((prevMessages) => [...prevMessages, { senderId: user.id, text }]);
        } else {
          console.error("Error sending message:", response.message);
        }
      });
      setMessageInput("");
    }
  };

  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen text-gray-600">Loading socket...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white text-lg font-semibold py-3 px-4 shadow-md">
        Chat with {recipient?.username}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20"> {/* Added pb-20 for padding at the bottom */}
        {messages.map((message, index) => {
          const isSentByUser = message.senderId !== recipientId;
          return (
            <div
              key={index}
              className={`flex ${isSentByUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg text-white max-w-[70%] ${
                  isSentByUser ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input - Fixed at the Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex items-center max-w-2xl mx-auto"> {/* Centered and max-width for responsiveness */}
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;