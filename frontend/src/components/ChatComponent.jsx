import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '../api/socket.js';
import { useParams } from 'react-router-dom';
import { getChatHistory } from '../api/api';
import '../styles/chat-component.css';

const ChatComponent = () => {
  const { recipientId } = useParams();
  const isInitialized = useSelector((state) => state.socket.isInitialized);
  const { user } = useSelector((state) => state.auth);
  const socket = getSocket();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await getChatHistory(recipientId);
        setMessages(response.data.messages);
        setRecipient(response.data.recipient);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [recipientId]);

  useEffect(() => {
    if (isInitialized && socket) {
      socket.on('newMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [isInitialized, socket]);

  const sendMessage = () => {
    if (socket && messageInput.trim() !== '') {
      const text = messageInput;
      socket.emit('sendMessage', { recipientId, text }, (response) => {
        if (response.status !== 'error') {
          // setMessages((prevMessages) => [...prevMessages, { senderId: user.id, text }]);
        } else {
          console.error('Error sending message:', response.message);
        }
      });
      setMessageInput('');
    }
  };

  if (!isInitialized) {
    return <div className="chat-loading">Loading socket...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">Chat with {recipient?.username}</div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.senderId === recipientId ? 'received' : 'sent'}`}>
            <span className="message-text">{message.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="chat-send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;

// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { getSocket } from '../api/socket.js';
// import { useParams } from 'react-router-dom';
// import { getChatHistory } from '../api/api';

// const ChatComponent = () => {
//   const { recipientId } = useParams();
//   const isInitialized = useSelector((state) => state.socket.isInitialized);
//   const { user } = useSelector((state) => state.auth);
//   const socket = getSocket();
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const [recipient, setRecipient] = useState(null);

//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       try {
//         const response = await getChatHistory(recipientId);
//         setMessages(response.data.messages);
//         setRecipient(response.data.recipient);
//       } catch (error) {
//         console.error('Error fetching chat history:', error);
//       }
//     };

//     fetchChatHistory();
//   }, [recipientId]);

//   useEffect(() => {
//     if (isInitialized && socket) {
//       socket.on('newMessage', (message) => {
//         console.log('New message:', message);
//         setMessages((prevMessages) => [...prevMessages, message]);
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.off('newMessage');
//       }
//     };
//   }, [isInitialized, socket]);

//   const sendMessage = () => {
//     if (socket) {
//       const text = messageInput;
//       socket.emit('sendMessage', { recipientId, text }, (response) => {
//         if (response.status === 'error') {
//           console.error('Error sending message:', response.message);
//         } else {
//           console.log('Message sent successfully:', response.message);
//         }
//       });
//       setMessageInput('');
//     } else {
//       console.error('Socket is not initialized');
//     }
//   };

//   if (!isInitialized) {
//     return <div>Loading socket...</div>;
//   }

//   return (
//     <div>
//       <h2>Chatting with {recipient?.username}</h2>
//       <br />
//       <div>
//         {messages.map((message, index) => (
//           <div key={index}>
//             <strong>{message.senderId==recipientId ? recipient.username:user}:</strong> {message.text}
//           </div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={messageInput}
//         onChange={(e) => setMessageInput(e.target.value)}
//         placeholder="Type a message..."
//       />
//       <button onClick={sendMessage}>Send Message</button>
//     </div>
//   );
// };

// export default ChatComponent;