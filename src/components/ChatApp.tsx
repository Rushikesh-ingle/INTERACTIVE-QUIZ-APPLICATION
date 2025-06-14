import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Wifi, WifiOff } from 'lucide-react';
import MessageList from './MessageList';
import UserList from './UserList';
import ConnectionStatus from './ConnectionStatus';
import TypingIndicator from './TypingIndicator';

interface User {
  id: string;
  username: string;
  avatar: string;
}

interface Message {
  id: string;
  type: 'message';
  content: string;
  user: User;
  timestamp: string;
}

interface TypingUser {
  id: string;
  username: string;
}

const ChatApp: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const websocket = new WebSocket('ws://localhost:8080');

      websocket.onopen = () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'welcome':
              setCurrentUser(data.user);
              setMessages(data.history || []);
              break;
              
            case 'message':
              setMessages(prev => [...prev, data]);
              break;
              
            case 'userList':
              setUsers(data.users);
              break;
              
            case 'typing':
              setTypingUsers(prev => {
                const filtered = prev.filter(u => u.id !== data.user.id);
                if (data.isTyping) {
                  return [...filtered, data.user];
                }
                return filtered;
              });
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocket.onclose = () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
        setWs(null);
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setTimeout(connectWebSocket, 3000);
    }
  };

  const sendMessage = () => {
    if (!ws || !inputMessage.trim() || !isConnected) return;

    ws.send(JSON.stringify({
      type: 'message',
      content: inputMessage.trim()
    }));

    setInputMessage('');
    handleStopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    handleTyping();
  };

  const handleTyping = () => {
    if (!ws || !isConnected) return;

    if (!isTyping) {
      setIsTyping(true);
      ws.send(JSON.stringify({
        type: 'typing',
        isTyping: true
      }));
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (!ws || !isConnected || !isTyping) return;

    setIsTyping(false);
    ws.send(JSON.stringify({
      type: 'typing',
      isTyping: false
    }));

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className={`${showUserList ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:relative z-30 w-80 h-full bg-white border-r border-gray-200 
        transition-transform duration-300 ease-in-out`}>
        
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">ChatApp</h1>
              <ConnectionStatus isConnected={isConnected} />
            </div>
            {currentUser && (
              <div className="mt-4 flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.username}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-medium text-gray-900">{currentUser.username}</p>
                  <p className="text-sm text-gray-500">You</p>
                </div>
              </div>
            )}
          </div>
          
          <UserList users={users} currentUser={currentUser} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Users className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">General Chat</h2>
              <p className="text-sm text-gray-500">{users.length} users online</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-500">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm font-medium">Reconnecting...</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} currentUser={currentUser} />
          <TypingIndicator typingUsers={typingUsers} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={!isConnected}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!isConnected || !inputMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {showUserList && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowUserList(false)}
        />
      )}
    </div>
  );
};

export default ChatApp;