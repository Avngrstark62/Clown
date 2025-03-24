import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getSocket } from "../api/socket.js";
import { useParams } from "react-router-dom";
import { getChatHistory } from "../api/api";
import Messages from "../classes/Messages";

const ChatComponent = () => {
  const { recipientId } = useParams();
  const isInitialized = useSelector((state) => state.socket.isInitialized);
  const socket = getSocket();
  const [messagesState, setMessagesState] = useState(new Messages());
  const [messageInput, setMessageInput] = useState("");
  const [recipient, setRecipient] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const chatContainerRef = useRef(null);
  const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState(null);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await getChatHistory(recipientId, { oldestMessageTimestamp });
        if (response.data.messages.length > 0) {
          setMessagesState(prevState => {
            const newState = new Messages();
            newState.head = prevState.head;
            newState.tail = prevState.tail;
            newState.prependMessages(response.data.messages);
            return newState;
          });
          setOldestMessageTimestamp(response.data.messages[0].timestamp);
        }
        setRecipient(response.data.recipient);
        
        if (firstLoad) {
          setTimeout(() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
          }, 100);
          setFirstLoad(false);
        }
  
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
  
    fetchChatHistory();
  }, [recipientId]);

  useEffect(() => {
    if (isInitialized && socket) {
      socket.on("newMessage", (message) => {
        setMessagesState(prevState => {
          const newState = new Messages();
          newState.head = prevState.head;
          newState.tail = prevState.tail;
          newState.appendMessages(message);
          return newState;
        });
  
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
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
          setMessagesState(prevState => {
            const newState = new Messages();
            newState.head = prevState.head;
            newState.tail = prevState.tail;
            newState.appendMessages({ senderId: user.id, text });
            return newState;
        });
        } else {
          console.error("Error sending message:", response.message);
        }
      });
      setMessageInput("");
    }
  };

  const handleScroll = async () => {
    if (!chatContainerRef.current || loadingOlderMessages) return;
    
    const { scrollTop } = chatContainerRef.current;
    if (scrollTop === 0) {
      setLoadingOlderMessages(true);
      try {
        const response = await getChatHistory(recipientId, {oldestMessageTimestamp});
        if (response.data.messages.length > 0) {
          setMessagesState(prevState => {
              const newState = new Messages();
              newState.head = prevState.head;
              newState.tail = prevState.tail;
              newState.prependMessages(response.data.messages);
              return newState;
          });
          setOldestMessageTimestamp(response.data.messages[0].timestamp);
        }
      } catch (error) {
        console.error("Error fetching older messages:", error);
      }
      setLoadingOlderMessages(false);
    }
  };

  console.log(messagesState.getAllMessages());

  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen text-gray-600">Loading socket...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 pt-16">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white text-lg font-semibold py-3 px-4 shadow-md">
        Chat with {recipient?.username}
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 pb-20"
      >
        {messagesState.getAllMessages().map((message, index) => {
            const isSentByUser = message.senderId !== recipientId;
            return (
                <div key={index} className={`flex ${isSentByUser ? "justify-end" : "justify-start"}`}>
                    <div className={`px-4 py-2 rounded-lg text-white max-w-[70%] ${
                        isSentByUser ? "bg-blue-500" : "bg-gray-600"
                    }`}>
                        {message.text}
                    </div>
                </div>
            );
        })}
      </div>

      {/* Chat Input - Fixed at the Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex items-center max-w-2xl mx-auto">
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