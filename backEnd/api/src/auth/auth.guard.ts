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

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger = new Logger(JwtAuthGuard.name);
  private readonly EXPIRED = 'jwt expired';
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
    let user;

    let accessResult = true;
    let refreshResult = true;
    try {
      user = await this.jwtService.verifyAsync(accessToken);
    } catch (e) {
      this.logger.debug('access token error');
      if (e.message === this.EXPIRED) {
        accessResult = false;
      } else {
        throw e;
      }
    }

    try {
      user = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (e) {
      this.logger.debug('refresh token error');

      if (e.message === this.EXPIRED) {
        refreshResult = false;
      } else {
        throw e;
      }
    }

    if (accessResult) {
      if (!refreshResult) {
        // access 토큰이 유효한데 refresh 토큰이 expired 됐으면 업데이트
        const newRefreshToken = await this.authService.getRefreshToken(user);
        this.authService.setRefreshToken(response, newRefreshToken, user.sub);
      }

      request.user = this.serializeUser(user);
      return true;
    }

    if (!accessResult && refreshResult) {
      // access token 만료.
      const refreshTokenHave = this.redisService.getRefreshToken(user.sub);
      if (refreshTokenHave !== refreshToken) return false; // 리프레시 토큰이 유효하지 않아요!

      // accessToken 재발급
      const newAccessToken = await this.authService.getAccessToken(user);
      this.authService.setAccessToken(response, newAccessToken);

      request.user = this.serializeUser(user);
      return true;
    }

    return false;
  }

  serializeUser(user) {
    return { id: user.sub, name: user.name };
  }
}
