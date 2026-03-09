import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { SendMessageDto } from '../../message/dto/send-message.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Controller('chat-rooms')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('my')
  getMyChats(@Req() req) {
    const userId = req.user.userId;
    return this.chatService.getUserChats(userId);
  }

  @Post('message')
  sendMessage(
    @CurrentUser() user,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(Number(user.userId), dto.chatRoomId, dto.content);
  }

  @Get(':chatRoomId/unread-count')
  getUnreadCount(
    @Param('chatRoomId') chatRoomId: number,
    @CurrentUser() user,
  ) {
    return this.chatService.getUnreadCount(chatRoomId, Number(user.userId));
  }

  @Get(':chatRoomId/messages')
  getMessages(
    @Param('chatRoomId') chatRoomId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.chatService.getMessages(chatRoomId, page, limit);
  }
}