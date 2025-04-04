"use client";
import { useState, KeyboardEvent } from "react";
import { sendMessage } from "../../lib/api";

export default function MessageInput({ onSend, chatName, loggedInUser }: { onSend: (message: string) => void, chatName: string, loggedInUser: string }) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim()) {
      // Call the parent handler to update UI
      onSend(message);

      // POST request to send the message
      // try {
      //   const response = await sendMessage(loggedInUser, chatName, message);
      //   console.log("Message sent successfully", response);
      // } catch (error) {
      //   console.error("Error sending message", error);
      // }
      setMessage(""); // Reset message input
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t flex bg-white items-center">
      <input
        type="text"
        className="flex-1 p-2 border rounded-md focus:outline-none text-gray-800"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

