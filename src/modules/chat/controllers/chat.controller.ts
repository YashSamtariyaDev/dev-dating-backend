import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { SendMessageDto } from '../../message/dto/send-message.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  sendMessage(
    @CurrentUser() user,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(Number(user.userId), dto.chatRoomId, dto.content);
  }

  @Get(':chatRoomId/messages')
  getMessages(@Param('chatRoomId') chatRoomId: number) {
    return this.chatService.getMessages(chatRoomId);
  }
}