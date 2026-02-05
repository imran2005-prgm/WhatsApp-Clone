import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatList({ setCurrentChat, currentChat, currentUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        setUsers(res.data.filter(u => u._id !== currentUser._id));
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [currentUser]);

  return (
    <div className="w-1/3 border-r h-full overflow-y-scroll bg-white">
      <div className="p-4 border-b bg-gray-50 sticky top-0">
        <h2 className="text-xl font-bold text-gray-700">Chats</h2>
      </div>
      <div className="p-2">
        {users.map(user => (
          <div
            key={user._id}
            onClick={() => setCurrentChat(user)}
            className={`flex items-center p-3 cursor-pointer rounded-lg mb-1 hover:bg-gray-100 ${currentChat?._id === user._id ? 'bg-gray-200' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 text-white font-bold text-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-800">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
