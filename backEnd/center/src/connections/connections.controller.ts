import { Controller, Post, Body } from '@nestjs/common';
import { SignalingConnectionDto } from './dto/signaling-connections.dto';
import { ReturnConnectionsDto } from './dto/return-connections.dto copy';
import { EventsService } from 'src/events/events.service';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly eventService: EventsService) {}

  @Post('signaling/join')
  async create(@Body() data: SignalingConnectionDto) {
    const response: ReturnConnectionsDto =
      this.eventService.findSignalingServer(data);
    return response;
  }

  @Post('leave')
  leave(@Body() data: SignalingConnectionDto) {
    this.eventService.leaveRoom(data);
    return 'leave Success';
  }
}
