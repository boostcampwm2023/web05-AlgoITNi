import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { WebRtcGateway } from 'src/webRTC/web-rtc.gateway';

@Module({
  providers: [EventsService, WebRtcGateway],
  exports: [EventsService],
})
export class EventsModule {}
