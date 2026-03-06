import { IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  chatRoomId: number;

  @IsString()
  content: string;
}