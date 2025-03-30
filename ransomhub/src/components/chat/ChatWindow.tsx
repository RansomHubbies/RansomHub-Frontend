// "use client";
// import { useState, useEffect } from "react";
// import MessageInput from "./MessageInput";
// import { sendMessage } from "../../lib/api";  // Import the sendMessage API
// import Pusher from "pusher-js";

// declare global {
//   interface Window {
//     pusherInstance: any;
//   }
// }

// export default function ChatWindow({ chatId, chatName }: { chatId: string, chatName: string }) {
//   console.log("Chat ID:", chatId);
//   console.log("Chat Name:", chatName);

//   const initialUser = localStorage.getItem("username") || null;  // Fetch logged-in username from localStorage
//   const [loggedInUser, setLoggedInUser] = useState(initialUser);
//   const [messages, setMessages] = useState<any[]>([]);

//   useEffect(() => {
//     if (!chatId || !loggedInUser) {
//       console.log("Missing required data, waiting...");
//       return;
//     }

//     const pusher = new Pusher("8f6f12497ce080d72d54", {
//       cluster: "ap2",
//     });

//     const channel = pusher.subscribe(loggedInUser);

//     channel.bind(chatId, (data: { message: string }) => {
//       setMessages(prevMessages => [
//         ...prevMessages,
//         { sender: chatId, text: data.message, isMe: false },
//       ]);
//     });
//     // console.log("Pusher channel bound to:", data);
//     window.pusherInstance = pusher;

//     return () => {
//       pusher.unsubscribe(loggedInUser);
//       window.pusherInstance = null;
//     };
//   }, [chatId, loggedInUser]);

//   const handleSendMessage = async (message: string) => {
//     if (!loggedInUser || !chatId) {
//       return;
//     }

//     setMessages(prevMessages => [
//       ...prevMessages,
//       { sender: loggedInUser, text: message, isMe: true },
//     ]);

//     // Call sendMessage API with correct sender value
//     await sendMessage(loggedInUser, chatId, message);  // Send message with logged-in user as sender
//   };

//   if (!loggedInUser) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-4 border-b bg-white flex items-center">
//         <h2 className="font-bold text-gray-900">Chat with {chatName}</h2>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
//         {messages.map((msg, index) => (
//           <div key={index} className={`mb-2 ${msg.isMe ? "text-right" : "text-left"}`}>
//             <p className={`inline-block p-2 rounded ${msg.isMe ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
//               {msg.text}
//             </p>
//           </div>
//         ))}
//       </div>
//       <MessageInput chatName={chatId} loggedInUser={loggedInUser} onSend={handleSendMessage} />
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import { sendMessage } from "../../lib/api";  // Import the sendMessage API
import Pusher from "pusher-js";

interface Message {
  sender: string;
  recipient: string;
  message: string;
  timestamp: string;
  isMe?: boolean;
}

interface DisplayMessage {
  sender: string;
  text: string;
  isMe: boolean;
  timestamp?: string;
}

declare global {
  interface Window {
    pusherInstance: any;
  }
}

export default function ChatWindow({ chatId, chatName }: { chatId: string, chatName: string }) {
  console.log("Chat ID:", chatId);
  console.log("Chat Name:", chatName);

  const initialUser = localStorage.getItem("username") || null;  // Fetch logged-in username from localStorage
  const [loggedInUser, setLoggedInUser] = useState(initialUser);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch previous messages when chat changes
  useEffect(() => {
    if (!chatId || !loggedInUser) {
      console.log("Missing required data for chat history");
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/chat/get_messages?sender=${loggedInUser}&recipient=${chatId}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching messages: ${response.status}`);
        }
        
        const data: Message[] = await response.json();
        
        // Sort messages by timestamp (oldest first)
        const sortedMessages = data.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        // Convert to display format and determine if message is from logged-in user
        const formattedMessages: DisplayMessage[] = sortedMessages.map(msg => ({
          sender: msg.sender,
          text: msg.message,
          isMe: msg.sender === loggedInUser,
          timestamp: msg.timestamp
        }));
        
        setMessages(formattedMessages);
        console.log("Fetched and loaded", formattedMessages.length, "messages");
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, loggedInUser]);

  // Set up Pusher for real-time messages
  useEffect(() => {
    if (!chatId || !loggedInUser) {
      console.log("Missing required data, waiting...");
      return;
    }

    const pusher = new Pusher("8f6f12497ce080d72d54", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe(loggedInUser);

    channel.bind(chatId, (data: { message: string }) => {
      // Update the chat in real-time with new messages
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: chatId, text: data.message, isMe: false },
      ]);
    });
    
    window.pusherInstance = pusher;

    return () => {
      pusher.unsubscribe(loggedInUser);
      window.pusherInstance = null;
    };
  }, [chatId, loggedInUser]);

  const handleSendMessage = async (message: string) => {
    if (!loggedInUser || !chatId) {
      return;
    }

    // Add message to UI immediately
    setMessages(prevMessages => [
      ...prevMessages,
      { sender: loggedInUser, text: message, isMe: true },
    ]);

    // Call sendMessage API with correct sender value
    try {
      await sendMessage(loggedInUser, chatId, message);  // Send message with logged-in user as sender
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally handle the error in UI
    }
  };

  if (!loggedInUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white flex items-center">
        <h2 className="font-bold text-gray-900">Chat with {chatName}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.isMe ? "text-right" : "text-left"}`}>
              <p className={`inline-block p-2 rounded ${msg.isMe ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                {msg.text}
              </p>
              {msg.timestamp && (
                <span className="text-xs text-gray-500 block">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          ))
        )}
      </div>
      <MessageInput chatName={chatId} loggedInUser={loggedInUser} onSend={handleSendMessage} />
    </div>
  );
}
