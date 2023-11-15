import { Controller, Post, Body } from '@nestjs/common';
import { ConnectionsService } from './connections.service';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post()
  create() {
    const url = this.connectionsService.create();
    return { url: url };
  }
}
