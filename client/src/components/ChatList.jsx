import { useEffect, useState } from 'react';
import axios from 'axios';
import GroupModal from './GroupModal';

export default function ChatList({ setCurrentChat, currentChat, currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]); // For starting new chats
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [view, setView] = useState('conversations'); // 'conversations' or 'contacts'

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/conversations/${currentUser._id}`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser, view]); // Reload when view changes (e.g. after creating group)

  // Fetch users for "New Contact" list (legacy 1-1)
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

  const handleGroupCreated = (newGroup) => {
    setConversations([newGroup, ...conversations]);
    setView('conversations');
    setCurrentChat(newGroup);
  };

  const startOneOnOne = async (user) => {
    try {
        const res = await axios.post("http://localhost:5000/api/conversations", {
            senderId: currentUser._id,
            receiverId: user._id
        });
        // Check if already exists in list to avoid duplicates (though backend handles idempotency)
        if (!conversations.find(c => c._id === res.data._id)) {
            setConversations([res.data, ...conversations]);
        }
        setCurrentChat(res.data);
        setView('conversations');
    } catch (err) {
        console.log(err);
    }
  };

  const getChatName = (c) => {
      if (c.isGroup) return c.name;
      const other = c.members.find(m => m._id !== currentUser._id);
      return other ? other.username : "Unknown User";
  };

  return (
    <div className="w-1/3 border-r h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700">Chats</h2>
        <div className="flex gap-2">
            <button onClick={() => setView('contacts')} className="text-green-600 text-sm font-semibold hover:underline" title="New Chat">
                + New Chat
            </button>
             <button onClick={() => setShowGroupModal(true)} className="text-green-600 text-sm font-semibold hover:underline" title="New Group">
                + Group
            </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {view === 'conversations' ? (
             conversations.map(c => (
              <div
                key={c._id}
                onClick={() => setCurrentChat(c)}
                className={`flex items-center p-3 cursor-pointer rounded-lg mb-1 hover:bg-gray-100 ${currentChat?._id === c._id ? 'bg-gray-200' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 text-white font-bold text-lg shrink-0">
                  {c.isGroup ? c.name.charAt(0).toUpperCase() : getChatName(c).charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-gray-800 truncate">{getChatName(c)}</span>
                    {c.isGroup && <span className="text-xs text-gray-500">Group</span>}
                </div>
              </div>
            ))
        ) : (
            <div>
                 <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Select Contact</div>
                 {users.map(user => (
                    <div
                        key={user._id}
                        onClick={() => startOneOnOne(user)}
                        className="flex items-center p-3 cursor-pointer rounded-lg mb-1 hover:bg-gray-100"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 text-white font-bold text-lg shrink-0">
                             {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{user.username}</span>
                    </div>
                 ))}
                 <button onClick={() => setView('conversations')} className="w-full text-center text-sm text-gray-500 mt-4 underline">Back to Chats</button>
            </div>
        )}
      </div>
      
      {showGroupModal && (
        <GroupModal 
            currentUser={currentUser} 
            onClose={() => setShowGroupModal(false)} 
            onGroupCreated={handleGroupCreated} 
        />
      )}
    </div>
  );
}
