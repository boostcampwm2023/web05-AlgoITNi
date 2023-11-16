import { Module } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';

@Module({
  controllers: [CodesController],
  providers: [CodesService],
})
export class CodesModule {}
