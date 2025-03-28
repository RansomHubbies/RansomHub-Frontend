// "use client";
// import { useState } from "react";

// export default function MessageInput({ onSend }: { onSend: (message: string) => void }) {
//   const [message, setMessage] = useState("");

//   const handleSend = () => {
//     if (message.trim()) {
//       onSend(message);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="p-4 border-t flex bg-white">
//       <input
//         type="text"
//         className="flex-1 p-2 border rounded-md focus:outline-none text-gray-800"
//         placeholder="Type a message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSend}>
//         Send
//       </button>
//     </div>
//   );
// }

"use client";
import { useState, KeyboardEvent } from "react";

export default function MessageInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t flex bg-white">
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