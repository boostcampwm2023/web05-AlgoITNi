import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

//https://soonyubi.github.io/jwt-refresh-token/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('validate', payload);
    return { userId: payload.sub, username: payload.username };
  }

  fail(status: number) {
    console.log(status, 'fail');
    super.fail(status);
  }

  success(user: any, info?: any) {
    console.log('success');
    super.success(user, info);
  }

  redirect(url: string, status?: number) {
    console.log('redirect');
    super.redirect(url, status);
  }

  pass() {
    console.log('pass');
    super.pass();
  }

  error(err: Error) {
    console.log('error');
    super.error(err);
  }

  authenticate(req: Request, options?: any) {
    console.log('authneticate');
    super.authenticate(req, options);
  }
}
