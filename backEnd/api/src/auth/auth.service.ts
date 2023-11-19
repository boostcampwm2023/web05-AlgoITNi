import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInfoDto } from '../users/dto/userInfo.dto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}
  async getAccessToken(userInfo: UserInfoDto) {
    return await this.jwtService.signAsync({
      id: userInfo.id,
      name: userInfo.name,
    });
  }

  async getRefreshToken(userInfo: UserInfoDto) {
    return await this.jwtService.signAsync(
      {
        id: userInfo.id,
        name: userInfo.name,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
      },
    );
  }

  async login(userInfo: UserInfoDto) {
    const access_token = await this.getAccessToken(userInfo);
    const refresh_token = await this.getRefreshToken(userInfo);
    this.redisService.storeRefreshToken(userInfo.id, refresh_token);
    return { access_token, refresh_token };
  }
}
