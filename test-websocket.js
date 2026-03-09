const { io } = require('socket.io-client');

console.log('🔗 Attempting to connect to WebSocket...');

// Try connecting with different options
const socket = io('https://localhost:3000', {
  transports: ['websocket'],
  rejectUnauthorized: false, // Ignore SSL cert errors
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtYWlsIjoidDEyQGRldmRhdGluZy5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MzA1NDUwNCwiZXhwIjoxNzczMDgzMzA0fQ.UZP6BneS3Pjaro8vksRW_d345AESlb2ye8OmB14RtmU' // Fresh valid token
  }
});

socket.on('connect', () => {
  console.log('✅ Connected successfully!');
  console.log('Socket ID:', socket.id);
  
  // Try to join a room
  socket.emit('joinRoom', { chatRoomId: 1 }, (response) => {
    console.log('joinRoom response:', response);
    socket.disconnect();
  });
});

socket.on('connect_error', (error) => {
  console.log('❌ Connection error:', error.message);
  console.log('Full error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
});

// Timeout after 5 seconds
setTimeout(() => {
  if (!socket.connected) {
    console.log('⏰ Connection timeout');
    socket.disconnect();
  }
}, 5000);
