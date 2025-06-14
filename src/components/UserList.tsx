import React from 'react';

interface User {
  id: string;
  username: string;
  avatar: string;
}

interface UserListProps {
  users: User[];
  currentUser: User | null;
}

const UserList: React.FC<UserListProps> = ({ users, currentUser }) => {
  const otherUsers = users.filter(user => user.id !== currentUser?.id);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Online Users ({users.length})
        </h3>
        
        <div className="space-y-2">
          {otherUsers.map(user => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:border-blue-200 transition-colors"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-green-600 font-medium">Online</p>
              </div>
            </div>
          ))}
          
          {otherUsers.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8-4 4 4 0 018 4z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Waiting for others to join...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;