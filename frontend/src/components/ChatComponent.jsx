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
          // console.log(response.message);
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

  // console.log(messagesState.getAllMessages());

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 shadow-md border-b border-emerald-700">
        <h2 className="text-xl font-bold">@{recipient?.username}</h2>
        <p className="text-emerald-100 text-sm">{recipient?.name}</p>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
      >
        {messagesState.getAllMessages().length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messagesState.getAllMessages().map((message, index) => {
            const isSentByUser = message.senderId !== recipientId;
            return (
              <div
                key={index}
                className={`flex ${isSentByUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-5 py-3 rounded-2xl max-w-xs lg:max-w-md break-words font-medium ${
                    isSentByUser
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Input - Fixed at the Bottom */}
      <div className="bg-slate-50 border-t border-emerald-200 p-4 sticky bottom-0">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors flex-shrink-0"
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