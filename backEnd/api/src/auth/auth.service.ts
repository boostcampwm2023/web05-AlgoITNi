import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInfoDto } from '../users/dto/userInfo.dto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  private readonly refreshSecret;
  private readonly refreshExpire;
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {
    this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    this.refreshExpire = this.configService.get<string>('JWT_REFRESH_EXPIRE');
  }
  async getAccessToken(userInfo: UserInfoDto) {
    return this.jwtService.signAsync({
      sub: userInfo.id,
      name: userInfo.name,
    });
  }

  async getRefreshToken(userInfo: UserInfoDto) {
    return await this.jwtService.signAsync(
      {
        sub: userInfo.id,
        name: userInfo.name,
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpire,
      },
    );
  }

  async login(userInfo: UserInfoDto) {
    const access_token = await this.getAccessToken(userInfo);
    const refresh_token = await this.getRefreshToken(userInfo);
    this.redisService.storeRefreshToken(userInfo.id, refresh_token);
    return { access_token, refresh_token };
  }

  async logout(userInfo) {
    this.redisService.delRefreshToken(userInfo.userId);
  }
}
