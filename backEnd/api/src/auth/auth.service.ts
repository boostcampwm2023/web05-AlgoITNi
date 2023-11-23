import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInfoDto } from '../users/dto/userInfo.dto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { Response } from 'express';
import { calcCookieExpire } from '../common/utils';

@Injectable()
export class AuthService {
  private readonly refreshSecret;
  private readonly refreshExpire;
  private readonly accessExpire;
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {
    this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    this.refreshExpire = this.configService.get<string>('JWT_REFRESH_EXPIRE');
    this.accessExpire = this.configService.get<string>('JWT_ACCESS_EXPIRE');
  }

  async login(userInfo: UserInfoDto, res) {
    const access_token = await this.getAccessToken(userInfo);
    const refresh_token = await this.getRefreshToken(userInfo);

    this.setAccessToken(res, access_token);
    this.setRefreshToken(res, refresh_token, userInfo.id);
  }

  async logout(userInfo) {
    this.redisService.delRefreshToken(userInfo.id);
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

  setAccessToken(res: Response, access_token) {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      path: '/',
      secure: true,
      expires: calcCookieExpire(this.accessExpire),
    });
  }

  setRefreshToken(res: Response, refresh_token, id) {
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      path: '/',
      secure: true,
      expires: calcCookieExpire(this.refreshExpire),
    });

    this.redisService.storeRefreshToken(id, refresh_token);
  }
}
