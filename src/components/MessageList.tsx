import React, { useEffect, useRef } from 'react';

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

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isConsecutiveMessage = (currentMsg: Message, prevMsg: Message | null) => {
    if (!prevMsg) return false;
    const timeDiff = new Date(currentMsg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime();
    return currentMsg.user.id === prevMsg.user.id && timeDiff < 60000; // Within 1 minute
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400\" fill="none\" stroke="currentColor\" viewBox="0 0 24 24">
                <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to the chat!</h3>
            <p className="text-gray-500">Start a conversation by sending your first message.</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            const isOwnMessage = currentUser?.id === message.user.id;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isConsecutive = isConsecutiveMessage(message, prevMessage);
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${
                  isConsecutive ? 'mt-1' : 'mt-4'
                }`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                  {/* Avatar */}
                  {!isConsecutive && (
                    <img
                      src={message.user.avatar}
                      alt={message.user.username}
                      className={`w-8 h-8 rounded-full border-2 border-white shadow-sm flex-shrink-0 ${
                        isOwnMessage ? 'ml-2' : 'mr-2'
                      }`}
                    />
                  )}
                  {isConsecutive && <div className="w-8" />}
                  
                  {/* Message bubble */}
                  <div className="flex flex-col">
                    {!isConsecutive && (
                      <div className={`flex items-center space-x-2 mb-1 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <span className="text-sm font-medium text-gray-700">
                          {isOwnMessage ? 'You' : message.user.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      } ${
                        isConsecutive
                          ? isOwnMessage
                            ? 'rounded-tr-md'
                            : 'rounded-tl-md'
                          : ''
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;