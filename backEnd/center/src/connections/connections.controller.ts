import { Controller, Post, Body, Get } from '@nestjs/common';
import { JoinRoomDto } from './dto/join-room.dto';
import { EventsService } from 'src/events/events.service';
import { ResponseDto } from 'src/common/dto/common-response.dto';
import { EventsChatService } from 'src/events/events-chat.service';

@Controller()
export class ConnectionsController {
  constructor(
    private readonly eventService: EventsService,
    private readonly eventChatService: EventsChatService,
  ) {}

  @Get('join/signalling')
  findSignalingServer(@Body() data: JoinRoomDto): ResponseDto {
    const response: ResponseDto = this.eventService.findServer(data);
    return response;
  }

  @Get('leave/signalling')
  leaveSignaling(@Body() data: JoinRoomDto): ResponseDto {
    const response: ResponseDto = this.eventService.leaveRoom(data);
    return response;
  }

  @Get('join/chatting')
  findChattingServer(@Body() data: JoinRoomDto): ResponseDto {
    const response: ResponseDto = this.eventChatService.findServer(data);
    return response;
  }

  @Get('leave/chatting')
  leaveChatting(@Body() data: JoinRoomDto): ResponseDto {
    const response: ResponseDto = this.eventChatService.leaveRoom(data);
    return response;
  }
}
