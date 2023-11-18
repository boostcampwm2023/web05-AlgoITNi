import { Controller, Post, Body } from '@nestjs/common';
import { JoinRoomDto } from './dto/join-room.dto';
import { ResponseUrlDto } from './dto/response-url.dto copy';
import { EventsService } from 'src/events/events.service';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly eventService: EventsService) {}

  @Post('signaling/join')
  async create(@Body() data: JoinRoomDto) {
    const response: ResponseUrlDto =
      this.eventService.findSignalingServer(data);
    return response;
  }

  @Post('leave')
  leave(@Body() data: JoinRoomDto) {
    this.eventService.leaveRoom(data);
    return 'leave Success';
  }
}
