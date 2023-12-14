import { Module } from '@nestjs/common';
import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Code, CodeSchema } from './schemas/code.schemas';
import { AuthModule } from '../auth/auth.module';
import { SaveCodePipe } from './pipes/saveCode.pipe';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('NODE_ENV') === 'dev'
            ? configService.get<string>('MONGO_DEV')
            : configService.get<string>('MONGO_PROD'),
      }),
    }),
    MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }]),
    AuthModule,
  ],
  controllers: [CodesController],
  providers: [CodesService, SaveCodePipe],
})
export class CodesModule {}
