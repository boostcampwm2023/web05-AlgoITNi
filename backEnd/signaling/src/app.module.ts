import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { WebRtcGateway } from './webRTC/web-rtc.gateway';
import { WinstonLogger } from './common/logger/winstonLogger.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, WebRtcGateway, WinstonLogger],
})
export class AppModule {}
