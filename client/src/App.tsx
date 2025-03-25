
// import { useEffect, useRef, useState } from 'react'
// import './App.css'

// function App() {
//   const [messages, setMessages] = useState(["hi there", "hello"]);
//   const wsRef = useRef();
//   const inputRef = useRef();

//   useEffect(() => {
//     const ws = new WebSocket("http://localhost:8080");
//     ws.onmessage = (event) => {
//       setMessages(m => [...m, event.data])
//     }
//     wsRef.current = ws;

//     ws.onopen = () => {
//       ws.send(JSON.stringify({
//         type: "join",
//         payload: {
//           roomId: "red"
//         }
//       }))
//     }
//     return () => {
//       ws.close()
//     }
//   }, []);

//   return (
//     <div className='h-screen bg-black'>
//       <br /><br /><br />
//       <div className='h-[85vh]'>
//         {messages.map(message => <div className='m-8'> 
//           <span className='bg-white text-black rounded p-4 '>            
//             {message} 
//           </span>
//         </div>)}
//       </div>
//       <div className='w-full bg-white flex'>
//         <input ref={inputRef} id="message" className="flex-1 p-4"></input>
//         <button onClick={() => {
//           const message = inputRef.current?.value;
//           wsRef.current.send(JSON.stringify({
//             type: "chat",
//             payload: {
//               message: message
//             }
//           }))

//         }} className='bg-purple-600 text-white p-4'>
//           Send message
//         </button>
//       </div>
//     </div>
//   )
// }

// export default App
import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["hi there", "hello"]);
  const roomName = "Red Room"; // Example room name
  const wsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "red" },
        })
      );
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    wsRef.current = ws;

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    const message = inputRef.current?.value.trim();
    if (message && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: { message },
        })
      );
      inputRef.current.value = "";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header with Room Name */}
      <header className="bg-gray-800 p-4 text-center text-xl font-semibold shadow-lg">
        {roomName}
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex justify-start">
            <span className="bg-gray-800 text-white rounded-lg p-3 shadow-lg">
              {message}
            </span>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="w-full bg-gray-800 p-4 flex items-center">
        <input
          ref={inputRef}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-3 bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 rounded-lg transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
