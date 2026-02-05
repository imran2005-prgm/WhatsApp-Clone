import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function ChatWindow({ currentChat, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.emit("join_room", currentUser._id);
    
    socket.current.on("receive_message", (data) => {
       if (data.sender === currentChat?._id || data.receiver === currentChat?._id) {
          setMessages((prev) => [...prev, data]);
       }
    });

    return () => {
       socket.current.disconnect();
    }
  }, [currentUser, currentChat]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if(currentChat){
           const res = await axios.get(`http://localhost:5000/api/messages/${currentUser._id}/${currentChat._id}`);
           setMessages(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat, currentUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    let fileUrl = "";
    let type = "text";

    if (file) {
      const data = new FormData();
      data.append("file", file);
      try {
        const res = await axios.post("http://localhost:5000/api/upload", data);
        fileUrl = "uploads/" + res.data;
        type = file.type.startsWith("image") ? "image" : "file";
      } catch (err) {
        console.log("Upload failed", err);
      }
    }

    const message = {
      sender: currentUser._id,
      receiver: currentChat._id,
      text: newMessage,
      fileUrl,
      type,
      timestamp: Date.now()
    };
    
    socket.current.emit("send_message", message);

    try {
      const res = await axios.post("http://localhost:5000/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
      setFile(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  if (!currentChat) return <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">Select a chat to start messaging</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#efeae2]">
      {/* Header */}
      <div className="p-4 bg-gray-100 border-b flex items-center">
         <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 text-white font-bold text-lg">
              {currentChat.username.charAt(0).toUpperCase()}
          </div>
        <span className="font-bold text-gray-700">{currentChat.username}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-scroll p-4 space-y-4">
        {messages.map((m, index) => (
          <div key={index} ref={scrollRef} className={`flex ${m.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${m.sender === currentUser._id ? 'bg-[#d9fdd3] text-gray-800' : 'bg-white text-gray-800'} shadow-sm relative`}>
              <p>{m.text}</p>
              {m.fileUrl && (
                  m.type === 'image' ? 
                  <img src={`http://localhost:5000/${m.fileUrl}`} alt="shared" className="mt-2 max-w-xs rounded" /> :
                  <a href={`http://localhost:5000/${m.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center mt-2 text-blue-500 underline">Download File</a>
              )}
              <span className="text-xs text-gray-500 mt-1 block text-right">
                {new Date(m.createdAt || m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-gray-100 border-t items-center flex flex-col">
        {file && (
            <div className="w-full mb-2 bg-gray-200 p-2 rounded flex justify-between items-center text-sm">
                <span>Selected: {file.name}</span>
                <button onClick={() => setFile(null)} className="text-red-500 font-bold">X</button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="w-full flex gap-2 items-center">
            {/* File Upload Placeholder */}
             <label htmlFor="fileInput" className="cursor-pointer text-gray-500 hover:text-gray-700 p-2">
                📎
             </label>
             <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleFileChange} />
             
          <input
            className="flex-1 p-2 border rounded-lg focus:outline-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
