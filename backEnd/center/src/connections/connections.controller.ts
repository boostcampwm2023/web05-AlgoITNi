import { Controller, Post, Body } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { SignalingConnectionDto } from './dto/signaling-connections.dto';
import { RegisterSignalingSocket } from './dto/register-signaling-socket.dto';
import { ReturnConnectionsDto } from './dto/return-connections.dto copy';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('signaling')
  register(@Body() data: RegisterSignalingSocket) {
    return this.connectionsService.registerSockets(data);
  }

  @Post('signaling/join')
  create(@Body() data: SignalingConnectionDto) {
    const response: ReturnConnectionsDto =
      this.connectionsService.createConnection(data);
    return response;
  }

  @Post('signaling/leave')
  leave(@Body() data: SignalingConnectionDto) {
    this.connectionsService.leaveRoom(data);
    return 'leave Success';
  }
}
