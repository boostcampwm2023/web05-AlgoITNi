import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { jwtError } from '../common/utils';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger = new Logger(JwtAuthGuard.name);
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const accessToken = request.cookies.access_token;
    const refreshToken = request.cookies.refresh_token;
    if (!accessToken && !refreshToken) {
      throw new JsonWebTokenError(jwtError.NO_TOKEN);
    }

    const accessResult = await this.verifyAccessToken(accessToken);
    const refreshResult = await this.verifyRefreshToken(refreshToken);
    if (accessResult) {
      if (!refreshResult) {
        const newRefreshToken =
          await this.authService.getRefreshToken(accessResult);
        this.authService.setRefreshToken(
          response,
          newRefreshToken,
          accessResult.sub,
        );
      }

      request.user = this.serializeUser(accessResult);
      return true;
    }

    if (!accessResult && refreshResult) {
      const refreshTokenHave = await this.redisService.getRefreshToken(
        refreshResult.sub,
      );
      if (refreshTokenHave !== refreshToken) {
        this.logger.warn(
          `${refreshResult} 사용자가 변형된 리프레시 토큰을 보유함`,
        );
        return false;
      }

      const newAccessToken =
        await this.authService.getAccessToken(refreshResult);
      this.authService.setAccessToken(response, newAccessToken);

      request.user = this.serializeUser(refreshResult);
      return true;
    }

    return false;
  }

  serializeUser(user) {
    return { id: user.sub, name: user.name };
  }

  async verifyAccessToken(accessToken) {
    try {
      const user = await this.jwtService.verifyAsync(accessToken);
      return user;
    } catch (e) {
      this.logger.debug('access token error');
      if (e.message === jwtError.EXPIRED || e.message === jwtError.NO_TOKEN) {
        return false;
      } else {
        throw new JsonWebTokenError(e.message);
      }
    }
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const user = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      return user;
    } catch (e) {
      this.logger.debug('refresh token error');
      if (e.message === jwtError.EXPIRED || e.message === jwtError.NO_TOKEN) {
        return false;
      } else {
        throw e;
      }
    }
  }
}
