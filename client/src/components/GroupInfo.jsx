import { useState } from 'react';
import axios from 'axios';

export default function GroupInfo({ currentChat, currentUser, onClose }) {
  const [members, setMembers] = useState(currentChat.members);
  const [admins, setAdmins] = useState(currentChat.admins);
  const [newMemberId, setNewMemberId] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);

  const isAdmin = admins.includes(currentUser._id);

  const fetchAllUsers = async () => {
      try {
          const res = await axios.get("http://localhost:5000/api/users");
          setAllUsers(res.data.filter(u => !members.find(m => m._id === u._id)));
      } catch (err) {
          console.log(err);
      }
  };

  const handleAddMember = async () => {
      if(!newMemberId) return;
      try {
          await axios.put("http://localhost:5000/api/conversations/add-member", {
              conversationId: currentChat._id,
              memberId: newMemberId,
              adminId: currentUser._id
          });
          // Ideally fetch updated conversation or just update local state
          alert("Member added! Refreshing...");
          window.location.reload(); // Lazy reload for now, or callback to update parent
      } catch (err) {
          console.log(err);
          alert("Failed to add member");
      }
  };

  const handleMakeAdmin = async (memberId) => {
      try {
          await axios.put("http://localhost:5000/api/conversations/make-admin", {
              conversationId: currentChat._id,
              memberId: memberId,
              adminId: currentUser._id
          });
          setAdmins([...admins, memberId]);
      } catch (err) {
          console.log(err);
          alert("Failed to promote");
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{currentChat.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
          </div>

          <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Members ({members.length})</h3>
              <div className="overflow-y-auto max-h-60 border rounded">
                  {members.map(m => (
                      <div key={m._id} className="p-2 border-b last:border-0 flex justify-between items-center">
                          <span>{m.username} {admins.includes(m._id) && <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Admin</span>}</span>
                          {isAdmin && !admins.includes(m._id) && (
                              <button onClick={() => handleMakeAdmin(m._id)} className="text-xs text-blue-600 hover:underline">Make Admin</button>
                          )}
                      </div>
                  ))}
              </div>
          </div>

          {isAdmin && (
              <div className="mt-2">
                  {!showAddMember ? (
                      <button 
                        onClick={() => { setShowAddMember(true); fetchAllUsers(); }}
                        className="w-full bg-green-100 text-green-700 py-2 rounded hover:bg-green-200"
                      >
                          + Add Member
                      </button>
                  ) : (
                      <div className="flex gap-2">
                          <select 
                            className="flex-1 border rounded p-2" 
                            onChange={(e) => setNewMemberId(e.target.value)}
                            value={newMemberId}
                          >
                              <option value="">Select User</option>
                              {allUsers.map(u => (
                                  <option key={u._id} value={u._id}>{u.username}</option>
                              ))}
                          </select>
                          <button onClick={handleAddMember} className="bg-green-600 text-white px-3 rounded">Add</button>
                      </div>
                  )}
              </div>
          )}
      </div>
    </div>
  );
}
