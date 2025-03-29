
// "use client";
// import { useState, useEffect } from "react";
// import MessageInput from "./MessageInput";
// import { sendMessage } from "../../lib/api";
// import Pusher from "pusher-js";

// export default function ChatWindow({ chatId, chatName, currentUser }: { chatId: string, chatName: string, currentUser: string }) {
//   const [messages, setMessages] = useState<any[]>([]);
//   //print the chatName and currentUser
//   console.log("Chat Name:", chatName);
//   console.log("Current User:", currentUser);
  
//   //where is this chatWindow is being used? 

//   // Subscribe to the Pusher channel
//   useEffect(() => {
//     if (!chatName || !currentUser) {
//       console.error("Error: Missing chatName or currentUser. Cannot subscribe to Pusher channel.");
//       return;
//     }

//     const pusher = new Pusher("8f6f12497ce080d72d54", {
//       cluster: "ap2",
//     });

//     const channel = pusher.subscribe(currentUser);  // subscribing to the channel of the logged-in user

//     channel.bind(chatName, (data: { message: string }) => {
//       setMessages(prevMessages => [
//         ...prevMessages,
//         { sender: chatName, text: data.message, isMe: false },
//       ]);
//     });

//     return () => {
//       pusher.unsubscribe(currentUser); // Clean up the Pusher subscription
//     };
//   }, [chatName, currentUser]);

//   const handleSendMessage = async (message: string) => {
//     setMessages([...messages, { sender: currentUser, text: message, isMe: true }]);
//     await sendMessage(currentUser, chatName, message);  // Sending message via the API
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-4 border-b bg-white flex items-center">
//         <h2 className="font-bold text-gray-900">Chat with {chatName}</h2>
//       </div>
//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
//         {messages.map((msg, index) => (
//           <div key={index} className={`mb-2 ${msg.isMe ? "text-right" : "text-left"}`}>
//             <p className={`inline-block p-2 rounded ${msg.isMe ? "bg-blue-500" : "bg-gray-300"}`}>{msg.text}</p>
//           </div>
//         ))}
//       </div>
//       <MessageInput onSend={handleSendMessage} />
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import { sendMessage } from "../../lib/api";  // Import sendMessage from api
import Pusher from "pusher-js";

export default function ChatWindow({ chatId, chatName }: { chatId: string, chatName: string }) {
  console.log("Chat ID:", chatId); // Debugging chatId
  console.log("Chat Name:", chatName); // Debugging chatName
  const [messages, setMessages] = useState<any[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  // Fetch the currentUser once when the component mounts
  useEffect(() => {
    const fetchCurrentUser = () => {
      const loggedInUsername = localStorage.getItem("username");  // Retrieve username from localStorage
      if (!loggedInUsername) {
        console.error("No logged-in user found!");
        return;
      }
      setLoggedInUser(loggedInUsername || null);  // Set the current user
    };

    fetchCurrentUser();
  }, []);

  // Log the `chatName` and `currentUser` for debugging
  useEffect(() => {
    console.log("Chat Name:", chatName); // Debugging chatName
    console.log("Current User:", loggedInUser); // Debugging currentUser
    console.log("Chat ID:", chatId); // Debugging chatId

    if (!chatName || !loggedInUser) {
      console.error("Error: Missing chatName or currentUser. Cannot subscribe to Pusher channel.");
      return;
    }

    const pusher = new Pusher("8f6f12497ce080d72d54", {
      cluster: "ap2",
    });

    // Subscribe to the Pusher channel using the logged-in user as the channel
    const channel = pusher.subscribe(loggedInUser);  // Subscribe to the logged-in user's channel

    // Bind to the chatName (the person you're chatting with)
    channel.bind(chatName, (data: { message: string }) => {
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: chatName, text: data.message, isMe: false },
      ]);
    });

    return () => {
      pusher.unsubscribe(loggedInUser); // Unsubscribe from the channel when the component unmounts
    };
  }, [chatName, loggedInUser]);  // Only re-run when `chatName` or `loggedInUser` changes

  const handleSendMessage = async (message: string) => {
    if (!loggedInUser || !chatName) {
      return; // Prevent sending messages if there's no currentUser or chatName
    }

    setMessages([...messages, { sender: loggedInUser, text: message, isMe: true }]);
    await sendMessage(loggedInUser, chatName, message);  // Send the message via the API
  };

  if (!loggedInUser) {
    return <div>Loading...</div>;  // Show loading state until currentUser is fetched
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white flex items-center">
        <h2 className="font-bold text-gray-900">Chat with {chatName}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.isMe ? "text-right" : "text-left"}`}>
            <p className={`inline-block p-2 rounded ${msg.isMe ? "bg-blue-500" : "bg-gray-300"}`}>{msg.text}</p>
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
