"use client";
import { useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import { sendMessage, sendGroupMessage, decryptMessage, fetchUsers } from "../../lib/api";
import Pusher from "pusher-js";
import { Cookie } from "next/font/google";
import { getCSRFTokenFromCookie } from "@/app/api";



// interface Message {
//   sender: string;
//   recipient: string;
//   message: string;
//   timestamp: string;
//   iv: string;
//   isMe?: boolean;
// }

// interface DisplayMessage {
//   sender: string;
//   text: string;
//   isMe: boolean;
//   timestamp?: string;
// }





// // Update the Message interface to include file type
// interface Message {
//   sender: string;
//   recipient: string;
//   message: string;
//   timestamp: string;
//   iv: string;
//   isMe?: boolean;
//   type?: string;
//   file?: string;
//   filename?: string;
//   file_type?: string;
// }

// // Update the DisplayMessage interface
// interface DisplayMessage {
//   sender: string;
//   text: string;
//   isMe: boolean;
//   timestamp?: string;
//   type?: string;
//   file?: string;
//   filename?: string;
//   fileType?: string;
// }



// Update the interfaces at the top of the file
interface Message {
  sender: string;
  recipient?: string;
  group?: string;
  message: string;
  timestamp: string;
  iv: string;
  type?: string;
  file?: string;
  filename?: string;
  file_type?: string;
}

interface DisplayMessage {
  sender: string;
  text: string;
  isMe: boolean;
  timestamp?: string;
  type?: string;
  file?: string;
  filename?: string;
  fileType?: string;
  group?: string;
}


declare global {
  interface Window {
    pusherInstance: any;
  }
}

export default function ChatWindow({ chatId, chatName, isGroup }: { chatId: string, chatName: string, isGroup: boolean }) {

  const initialUser = localStorage.getItem("username") || null;
  const [loggedInUser, setLoggedInUser] = useState(initialUser);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  // Fetch previous messages when chat changes
  useEffect(() => {
    if (!chatId || !loggedInUser) {
      console.log("Missing required data for chat history");
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        if (!isGroup) {
          const response = await fetch(`http://127.0.0.1:8000/api/chat/get_messages?sender=${loggedInUser}&recipient=${chatId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "X-CSRFToken": getCSRFTokenFromCookie(),
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            setMessages([]);
            throw new Error(`Error fetching messages: ${response.status}`);
          }

          const data: Message[] = await response.json();

          // Sort messages by timestamp (oldest first)
          const sortedMessages = data.sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          // const decryptedMessages = await Promise.all(
          //   sortedMessages.map(async (msg) => {
          //     try {
          //       const decryptedText = await decryptMessage(
          //         loggedInUser,
          //         chatId,
          //         msg.message,
          //         msg.iv,
          //       );
          //       return {
          //         sender: msg.sender,
          //         text: decryptedText,
          //         isMe: msg.sender === loggedInUser,
          //         timestamp: msg.timestamp,
          //       };
          //     } catch (error) {
          //       console.error("Error decrypting message:", error);
          //       return {
          //         sender: msg.sender,
          //         text: "[Failed to decrypt]",
          //         isMe: msg.sender === loggedInUser,
          //         timestamp: msg.timestamp,
          //       };
          //     }
          //   })
          // );


          const decryptedMessages = await Promise.all(
            sortedMessages.map(async (msg) => {
              if (msg.type === 'file') {
                return {
                  sender: msg.sender,
                  text: `File: ${msg.filename}`,
                  isMe: msg.sender === loggedInUser,
                  timestamp: msg.timestamp,
                  type: 'file',
                  file: msg.file,
                  filename: msg.filename,
                  fileType: msg.file_type
                };
              }

              try {
                const decryptedText = await decryptMessage(
                  loggedInUser,
                  chatId,
                  msg.message,
                  msg.iv,
                );
                return {
                  sender: msg.sender,
                  text: decryptedText,
                  isMe: msg.sender === loggedInUser,
                  timestamp: msg.timestamp,
                };
              } catch (error) {
                console.error("Error decrypting message:", error);
                return {
                  sender: msg.sender,
                  text: "[Failed to decrypt]",
                  isMe: msg.sender === loggedInUser,
                  timestamp: msg.timestamp,
                };
              }
            })
          );


          setMessages(decryptedMessages);
          console.log("Fetched and loaded", decryptedMessages.length, "messages");
        }
        else {
          const response = await fetch(`http://127.0.0.1:8000/api/chat/get_group_messages?group=${chatId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "X-CSRFToken": getCSRFTokenFromCookie(),
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            setMessages([]);
            throw new Error(`Error fetching messages: ${response.status}`);
          }

          const data: Message[] = await response.json();

          // Sort messages by timestamp (oldest first)
          const sortedMessages = data.sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          // Convert to display format and determine if message is from logged-in user
          const formattedMessages: DisplayMessage[] = sortedMessages.map((msg) => {
            if (msg.type === 'file') {
              return {
                sender: msg.sender,
                text: `File: ${msg.filename}`,
                isMe: msg.sender === loggedInUser,
                timestamp: msg.timestamp,
                type: 'file',
                file: msg.file,
                filename: msg.filename,
                fileType: msg.file_type,
                group: msg.group
              };
            }
            else {
              return {
                sender: msg.sender,
                text: msg.message,
                isMe: msg.sender === loggedInUser,
                timestamp: msg.timestamp
              };
            }

            // sender: msg.sender,
            // text: msg.message,
            // isMe: msg.sender === loggedInUser,
            // timestamp: msg.timestamp
          });

          setMessages(formattedMessages);
          console.log("Fetched and loaded", formattedMessages.length, "messages");
        }
      }
      catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, loggedInUser, isGroup]);

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

    // channel.bind(chatId, async (data: { message: string, sender: string, iv: string }) => {
    //   var decryptedMessage = data.message;
    //   if (!isGroup) {
    //     decryptedMessage = await decryptMessage(loggedInUser, data.sender, data.message, data.iv)
    //   }
    //   setMessages(prevMessages => [
    //     ...prevMessages,
    //     {
    //       sender: data.sender || chatId, // Use the sender from data if available
    //       text: decryptedMessage,
    //       isMe: false
    //     },
    //   ]);
    // });

    channel.bind(chatId, async (data: {
      message: string,
      sender: string,
      iv: string,
      type?: string,
      file?: string,
      filename?: string,
      file_type?: string
    }) => {
      if (data.type === 'file') {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: data.sender,
            text: `File: ${data.filename}`,
            isMe: data.sender === loggedInUser,
            type: 'file',
            file: data.file,
            filename: data.filename,
            fileType: data.file_type,
            timestamp: new Date().toISOString()
          }
        ]);
      } else {
        const decryptedMessage = await decryptMessage(loggedInUser, data.sender, data.message, data.iv);
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: data.sender || chatId,
            text: decryptedMessage,
            isMe: false
          },
        ]);
      }
    });

    window.pusherInstance = pusher;

    return () => {
      pusher.unsubscribe(loggedInUser);
      window.pusherInstance = null;
    };
  }, [chatId, loggedInUser, isGroup]);

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
      if (isGroup) {
        await sendGroupMessage(loggedInUser, chatId, message);  // Send group message
      }
      else {
        await sendMessage(loggedInUser, chatId, message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally handle the error in UI
    }
  };

  // In the component, update the handleFileMessage function and add onFileSend handler
  const handleFileMessage = (fileMessage: DisplayMessage) => {
    setMessages(prevMessages => [
      ...prevMessages,
      fileMessage
    ]);
  };


  const handleOpenUserInfo = async () => {
    try {
      const usersData = await fetchUsers();
      const user = usersData.find((u: any) => u.username === chatId);
      if (user) {
        setSelectedUserDetails(user);
        setShowUserInfo(true);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  if (!loggedInUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <h2 className="font-bold text-gray-900">{chatName}</h2>
        {!isGroup && (
          <button
            className="text-blue-600 text-sm border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
            onClick={handleOpenUserInfo}
          >
            Info
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.isMe ? "text-right" : "text-left"}`}>
              <div className={`inline-block rounded-lg overflow-hidden max-w-md ${msg.isMe ? "bg-blue-800" : "bg-gray-600"}`}>
                {/* Sender info for group chats */}
                {(isGroup || msg.type === 'file') && !msg.isMe && (
                  <div className="px-3 py-1 text-xs font-medium text-blue bg-opacity-100 border-b"
                    style={{
                      backgroundColor: msg.isMe ? "rgba(37, 99, 235, 0.9)" : "rgba(75, 85, 99, 0.9)",
                      borderBottomColor: msg.isMe ? "#1d4ed8" : "#4b5563"
                    }}>
                    {msg.sender}
                  </div>
                )}
                {isGroup && msg.isMe && (
                  <div className="px-3 py-1 text-xs font-medium text-blue bg-opacity-100 border-b"
                    style={{
                      backgroundColor: "rgba(37, 99, 235, 0.9)",
                      borderBottomColor: "#1d4ed8"
                    }}>
                    You
                  </div>
                )}

                {/* Message content */}
                <div className={`p-3 ${msg.isMe ? "text-white" : ""}`}>
                  {msg.type === 'file' ? (
                    <>
                      <a
                        href={`data:${msg.fileType};base64,${msg.file}`}
                        download={msg.filename}
                        className="underline"
                      >
                        Download {msg.filename}
                      </a>
                      {msg.fileType?.startsWith('image/') && (
                        <img
                          src={`data:${msg.fileType};base64,${msg.file}`}
                          alt={msg.filename}
                          className="mt-2 max-w-full max-h-64 rounded"
                        />
                      )}
                    </>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
              {msg.timestamp && (
                <span className="text-xs text-gray-500 block mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          ))

        )}
      </div>
      <MessageInput
        chatName={chatId}
        loggedInUser={loggedInUser}
        onSend={handleSendMessage}
        onFileSend={handleFileMessage}
        isGroup={isGroup}
      />
      {showUserInfo && selectedUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[300px] shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Info</h3>
            <p className="text-gray-900">
              <strong>Full Name:</strong> {selectedUserDetails.name}
            </p>
            <p className="text-gray-900">
              <strong>Username:</strong> {selectedUserDetails.username}
            </p>
            <p className="text-gray-900">
              <strong>Email:</strong> {selectedUserDetails.email}
            </p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowUserInfo(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


