import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MessageService } from '../../message/services/message.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';

@WebSocketGateway({
  cors: {
    // Allow all origins in development; restrict to specific domains in production
    // by setting FRONTEND_URL in the .env file
    origin: process.env.FRONTEND_URL
      ? [
        process.env.FRONTEND_URL,
        'http://localhost',
        'http://localhost:3000',
        'http://localhost:3001',
      ]
      : true, // true = allow all origins
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, string>();

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) { }

  afterInit(server: Server) {
    console.log('🔌 WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    console.log('🔗 Client connected:', client.id);

    // Extract token from handshake
    const token = client.handshake.auth.token;
    if (!token) {
      console.log('❌ No token provided for client:', client.id);
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      console.log('✅ Client authenticated:', client.id, 'User ID:', payload.sub);
    } catch (error) {
      console.log('❌ Invalid token for client:', client.id);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('🔌 Client disconnected:', client.id);

    // Find and remove user from online users
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        this.server.emit('userOffline', userId);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  registerUser(
    @MessageBody() data: { userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.onlineUsers.set(data.userId, client.id);
    this.server.emit('userOnline', data.userId);

    return {
      success: true,
      userId: data.userId,
      onlineCount: this.onlineUsers.size,
    };
  }

  @SubscribeMessage('getOnlineUsers')
  getOnlineUsers() {
    return {
      onlineUsers: Array.from(this.onlineUsers.keys()),
      count: this.onlineUsers.size,
    };
  }

  @SubscribeMessage('isUserOnline')
  isUserOnline(@MessageBody() data: { userId: number }) {
    return {
      userId: data.userId,
      isOnline: this.onlineUsers.has(data.userId),
    };
  }

  // Join chat room
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId } = data;
    const userId = client.data.userId;

    console.log(`📱 User ${userId} joining room ${chatRoomId}`);

    client.join(`room-${chatRoomId}`);

    // await this.messageService.markAsDelivered(chatRoomId, userId);

    // this.server.to(`room-${chatRoomId}`).emit('messagesDelivered', {
    //   chatRoomId,
    //   userId,
    // });

    // Notify others in room
    client.to(`room-${chatRoomId}`).emit('userJoined', {
      userId,
      chatRoomId,
      message: `User ${userId} joined the room`,
    });

    return {
      success: true,
      message: `Joined room ${chatRoomId}`,
      chatRoomId,
      userId,
    };
  }

  @SubscribeMessage('markRead')
  async markRead(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId } = data;
    const userId = client.data.userId;

    console.log(`✅ User ${userId} marking messages read in room ${chatRoomId}`);

    // await this.messageService.markAsRead(chatRoomId, userId);

    // this.server.to(`room-${chatRoomId}`).emit('messagesRead', {
    //   chatRoomId,
    //   userId,
    // });

    return {
      success: true,
      chatRoomId,
      userId,
    };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { chatRoomId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.server
      .to(`room-${data.chatRoomId}`)
      .emit('userTyping', data);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody() data: { chatRoomId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.server
      .to(`room-${data.chatRoomId}`)
      .emit('userStoppedTyping', data);
  }

  // Send message realtime
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      chatRoomId: number;
      content: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    if (!userId) {
      return { error: 'Not authenticated' };
    }

    console.log(`💬 Message from user ${userId} in room ${data.chatRoomId}: ${data.content}`);

    try {
      const savedMessage = await this.messageService.sendMessage(userId, {
        chatRoomId: data.chatRoomId,
        content: data.content,
      });

      // Get sender info
      const sender = await this.usersService.findById(userId);

      // Emit message to room with sender info
      this.server
        .to(`room-${data.chatRoomId}`)
        .emit('newMessage', {
          id: savedMessage.id,
          senderId: userId,
          senderName: sender?.name || 'Unknown',
          content: savedMessage.content,
          createdAt: savedMessage.createdAt,
        });

      return {
        success: true,
        message: savedMessage,
      };
    } catch (error) {
      console.error('❌ Error saving message:', error);
      return {
        success: false,
        error: 'Failed to send message',
      };
    }
  }

  // Leave room
  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId } = data;
    const userId = client.data.userId;

    console.log(`📱 User ${userId} leaving room ${chatRoomId}`);

    client.leave(`room-${chatRoomId}`);

    // Notify others in room
    client.to(`room-${chatRoomId}`).emit('userLeft', {
      userId,
      chatRoomId,
      message: `User ${userId} left the room`,
    });

    return {
      success: true,
      message: `Left room ${chatRoomId}`,
    };
  }
}