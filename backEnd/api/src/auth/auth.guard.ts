import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger = new Logger(JwtAuthGuard.name);
  private readonly EXPIRED = 'jwt expired';
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private configService: ConfigService,
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
      // refresh 토큰이 expired 됐으면 업데이트
      if (!refreshResult) {
        const newRefreshToken = await this.authService.getRefreshToken(user);
        response.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
        });
      }

      request.user = this.serializeUser(user);
      return true;
    }

    if (refreshResult) {
      // accessToken 재발급
      const newAccessToken = await this.authService.getAccessToken(user);
      response.cookie('access_token', newAccessToken, {
        httpOnly: true,
      });

      request.user = this.serializeUser(user);
      return true;
    }

    return false;
  }

  serializeUser(user) {
    return { id: user.sub, name: user.name };
  }
}
