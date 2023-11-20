import { Controller, Post, Body } from '@nestjs/common';
import { JoinRoomDto } from './dto/join-room.dto';
import { ResponseUrlDto } from './dto/response-url.dto';
import { EventsService } from 'src/events/events.service';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly eventService: EventsService) {}

  @Post('join')
  async create(@Body() data: JoinRoomDto) {
    const response: ResponseUrlDto = this.eventService.findServer(data);
    return response;
  }

  @Post('leave')
  leave(@Body() data: JoinRoomDto) {
    this.eventService.leaveRoom(data);
    return 'leave Success';
  }
}
