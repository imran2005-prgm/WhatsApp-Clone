import { useState, useEffect } from 'react';
import axios from 'axios';

export default function GroupModal({ currentUser, onClose, onGroupCreated }) {
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

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

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || selectedUsers.length === 0) return;

    try {
      const res = await axios.post("http://localhost:5000/api/conversations", {
        senderId: currentUser._id,
        members: selectedUsers,
        isGroup: true,
        groupName
      });
      onGroupCreated(res.data);
      onClose();
    } catch (err) {
      console.log(err);
      alert("Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <input
            className="w-full p-2 border rounded mb-4"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <h3 className="font-semibold mb-2">Select Members:</h3>
          <div className="flex-1 overflow-y-auto mb-4 border rounded p-2">
            {users.map(user => (
              <div key={user._id} className="flex items-center p-2 hover:bg-gray-100">
                <input
                  type="checkbox"
                  id={`user-${user._id}`}
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleCheckboxChange(user._id)}
                  className="mr-2"
                />
                <label htmlFor={`user-${user._id}`} className="flex-1 cursor-pointer">{user.username}</label>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
