
// "use client";
// import { useState, KeyboardEvent } from "react";

// export default function MessageInput({ onSend }: { onSend: (message: string) => void }) {
//   const [message, setMessage] = useState("");

//   const handleSend = () => {
//     if (message.trim()) {
//       onSend(message);
//       setMessage("");
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       // Handle file upload logic here
//       console.log("File selected:", files[0]);
//       // You can implement file upload logic or pass it to parent component
//     }
//   };

//   return (
//     <div className="p-4 border-t flex bg-white items-center">
//       {/* Attachment button */}
//       <label className="mr-2 cursor-pointer">
//         <input 
//           type="file" 
//           className="hidden" 
//           onChange={handleFileUpload}
//           accept="image/*,video/*,.pdf,.doc,.docx"
//           multiple
//         />
//         <svg 
//           xmlns="http://www.w3.org/2000/svg" 
//           className="h-6 w-6 text-gray-500 hover:text-gray-700" 
//           fill="none" 
//           viewBox="0 0 24 24" 
//           stroke="currentColor"
//         >
//           <path 
//             strokeLinecap="round" 
//             strokeLinejoin="round" 
//             strokeWidth={2} 
//             d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
//           />
//         </svg>
//       </label>
      
//       <input
//         type="text"
//         className="flex-1 p-2 border rounded-md focus:outline-none text-gray-800"
//         placeholder="Type a message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//       />
//       <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSend}>
//         Send
//       </button>
//     </div>
//   );
// }
"use client";
import { useState, KeyboardEvent } from "react";
import { sendMessage } from "../../lib/api";

export default function MessageInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim()) {
      onSend(message);
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
