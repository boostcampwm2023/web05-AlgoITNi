import { Module } from '@nestjs/common';
import { WebRtcService } from './web-rtc.service';
import { WebRtcGateway } from './web-rtc.gateway';

@Module({
  providers: [WebRtcService, WebRtcGateway],
})
export class WebRtcModule {}
