import { Module } from '@nestjs/common';
import { GithubService } from './github/github.service';
import { GoogleService } from './google/google.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import {JwtStrategy} from "./auth.jwt.strategy";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRE'),
        },
      }),
    }),
    RedisModule,
  ],
  providers: [GithubService, GoogleService, AuthService, JwtStrategy],
  exports: [GithubService, GoogleService],
  controllers: [AuthController],
})
export class AuthModule {}
