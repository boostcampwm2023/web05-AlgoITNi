import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionsModule } from './connections/connections.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ConnectionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
