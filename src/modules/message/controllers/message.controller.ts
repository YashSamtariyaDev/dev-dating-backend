import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { MessageService } from '../services/message.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  sendMessage(@Req() req, @Body() dto: SendMessageDto) {
    const userId = Number(req.user.userId);
    return this.messageService.sendMessage(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':chatRoomId')
  getMessages(@Param('chatRoomId') chatRoomId: number) {
    return this.messageService.getMessages(Number(chatRoomId));
  }
}