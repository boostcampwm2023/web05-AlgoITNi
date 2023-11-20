import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { EventsService } from 'src/events/events.service';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService, EventsService],
})
export class ConnectionsModule {}
