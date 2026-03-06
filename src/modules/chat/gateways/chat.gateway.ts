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
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8081', 'http://127.0.0.1:8081', 'file://'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

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

      // Emit message to room with sender info
      this.server
        .to(`room-${data.chatRoomId}`)
        .emit('newMessage', {
          ...savedMessage,
          senderId: userId,
          timestamp: new Date(),
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