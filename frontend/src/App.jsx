// import React, { useState } from "react";

// const ChatbotApp = () => {
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hi! How can I help you today?" },
//   ]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     const botReply = await getBotReply(input);
//     setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
//   };

//   const getBotReply = async (message) => {
//     try {
//       const response = await fetch("http://localhost:8000/ask", { 
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({"question": message }),
//       });

//       const data = await response.json();
//       return data.answer || "Sorry, I didn't understand that.";
//     } catch (error) {
//       console.error("Error fetching bot reply:", error);
//       return "Something went wrong. Please try again later.";
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="h-[70vh] overflow-y-auto mb-4 p-4 bg-white shadow rounded-2xl space-y-2">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-2 rounded-xl max-w-[80%] text-sm whitespace-pre-wrap ${
//               msg.sender === "bot"
//                 ? "bg-gray-200 text-left"
//                 : "bg-blue-500 text-white self-end ml-auto"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>
//       {/* <div className="text-2xl text-green-600 font-bold underline">
//         Tailwind is working!
//       </div> */}
//       <div className="flex gap-2">
//         <input
//           className="border border-gray-300 p-2 flex-1 rounded"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatbotApp;

import React, { useState } from "react";

const ChatbotApp = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const botReply = await getBotReply(input);
    setIsTyping(false);
    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
  };

  const getBotReply = async (message) => {
    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();
      return data.answer || "Sorry, I don't know.";
    } catch (error) {
      console.error("Error fetching bot reply:", error);
      return "Something went wrong. Please try again later.";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center text-2xl font-bold mb-4 text-blue-600">
        💬 SmartChat Assistant
      </div>

      <div className="h-[70vh] overflow-y-auto mb-4 p-4 bg-white shadow-xl rounded-2xl space-y-2 border border-gray-200">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[80%] text-sm whitespace-pre-wrap ${
              msg.sender === "bot"
                ? "bg-gray-100 text-left text-gray-800"
                : "bg-blue-500 text-white self-end ml-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="p-3 bg-gray-100 text-gray-500 rounded-xl text-sm animate-pulse w-fit">
            Typing<span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
            <span className="animate-bounce delay-300">.</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="border border-gray-300 p-2 flex-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotApp;

