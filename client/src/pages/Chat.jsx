import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState(null);

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
        <ChatList setCurrentChat={setCurrentChat} currentChat={currentChat} currentUser={user} />
        <ChatWindow currentChat={currentChat} currentUser={user} />
    </div>
  );
}
