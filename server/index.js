import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const server = createServer();
const wss = new WebSocketServer({ server });

// Store connected clients and message history
const clients = new Map();
const messageHistory = [];
const MAX_HISTORY = 100;

// Generate unique user ID
function generateUserId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Generate random username
function generateUsername() {
  const adjectives = ['Cool', 'Smart', 'Quick', 'Bright', 'Swift', 'Bold', 'Calm', 'Kind'];
  const nouns = ['Panda', 'Eagle', 'Tiger', 'Dolphin', 'Wolf', 'Falcon', 'Bear', 'Fox'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

// Broadcast message to all clients
function broadcast(message, excludeClient = null) {
  const messageStr = JSON.stringify(message);
  clients.forEach((client, ws) => {
    if (ws !== excludeClient && ws.readyState === ws.OPEN) {
      ws.send(messageStr);
    }
  });
}

// Broadcast user list to all clients
function broadcastUserList() {
  const users = Array.from(clients.values()).map(client => ({
    id: client.id,
    username: client.username,
    avatar: client.avatar
  }));
  
  broadcast({
    type: 'userList',
    users
  });
}

wss.on('connection', (ws) => {
  const userId = generateUserId();
  const username = generateUsername();
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
  
  // Store client info
  clients.set(ws, {
    id: userId,
    username,
    avatar,
    ws
  });

  console.log(`User ${username} connected. Total users: ${clients.size}`);

  // Send welcome message and history
  ws.send(JSON.stringify({
    type: 'welcome',
    user: { id: userId, username, avatar },
    history: messageHistory
  }));

  // Broadcast updated user list
  broadcastUserList();

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      const client = clients.get(ws);
      
      if (!client) return;

      switch (message.type) {
        case 'message':
          const chatMessage = {
            id: Date.now().toString(),
            type: 'message',
            content: message.content,
            user: {
              id: client.id,
              username: client.username,
              avatar: client.avatar
            },
            timestamp: new Date().toISOString()
          };

          // Add to history
          messageHistory.push(chatMessage);
          if (messageHistory.length > MAX_HISTORY) {
            messageHistory.shift();
          }

          // Broadcast to all clients
          broadcast(chatMessage);
          break;

        case 'typing':
          // Broadcast typing indicator to other users
          broadcast({
            type: 'typing',
            user: {
              id: client.id,
              username: client.username
            },
            isTyping: message.isTyping
          }, ws);
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // Handle disconnect
  ws.on('close', () => {
    const client = clients.get(ws);
    if (client) {
      console.log(`User ${client.username} disconnected. Total users: ${clients.size - 1}`);
      clients.delete(ws);
      broadcastUserList();
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});