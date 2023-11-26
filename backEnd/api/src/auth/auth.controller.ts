import {
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GithubService } from './github/github.service';
import { GoogleService } from './google/google.service';
import { UsersService } from '../users/users.service';
import { UserInfoDto } from '../users/dto/userInfo.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  private oauth2Client;
  constructor(
    private githubService: GithubService,
    private googleService: GoogleService,
    private authService: AuthService,
    private userService: UsersService,
    private configService: ConfigService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('CLIENT_ID_GOOGLE'),
      this.configService.get<string>('CLIENT_SECRET_GOOGLE'),
      'http://localhost:4000/auth/google-callback',
    );
  }

  @Get('google')
  async googleProxy(@Res() res: Response, @Req() req: Request) {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    const authorizationUrl = this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
    });

    return res.redirect(authorizationUrl);
  }

  @Get('google-callback')
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    const { tokens } = await this.oauth2Client.getToken(code);

    const { id_token } = tokens;
    const segments = id_token.split('.');
    // All segment should be base64
    const headerSeg = segments[0];
    const payloadSeg = segments[1];
    function base64urlUnescape(str) {
      str += Array(5 - (str.length % 4)).join('=');
      return str.replace(/\-/g, '+').replace(/_/g, '/');
    }
    function base64urlDecode(str) {
      return new Buffer(base64urlUnescape(str), 'base64').toString();
    }

    // base64 decode and parse JSON
    const header = JSON.parse(base64urlDecode(headerSeg));
    const payload = JSON.parse(base64urlDecode(payloadSeg));
    console.log(header, payload);
    return res.redirect('http://localhost:3000');
  }

  @Get('github')
  async githubProxy(
    @Res() res: Response,
    @Req() req: Request,
    @Query('next') next: string,
    @Query('dev') dev: boolean,
  ) {
    req.session['returnTo'] = dev
      ? `http://${path.join('localhost:3000', next)}`
      : `https://${path.join('algoitni.site', next)}`;
    req.session.save((err) => {
      if (err) this.logger.log(err);
    });
    const redirectUrl = this.githubService.getAuthUrl();
    return res.redirect(redirectUrl);
  }

  @Get('github-callback')
  async githubCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    const accessToken = await this.githubService.getGithubAccessToken(code);
    const user = await this.githubService.getUserInfo(accessToken);
    let findUser = await this.userService.findUser(user);
    if (findUser === null) {
      await this.userService.addUser(user, 'github');
      findUser = await this.userService.findUser(user);
    }
    if (findUser.oauth !== 'github') {
      return { message: '다른 서비스로 가입한 내역이 있습니다.' }; // TODO: set StatusCode
    }

    const loginUser = new UserInfoDto();
    loginUser.id = findUser.id;
    loginUser.name = findUser.name;

    await this.authService.login(loginUser, res);
    const returnTo = req.session['returnTo'];

    delete req.session['returnTo'];
    req.session.save((err) => {
      if (err) this.logger.log(err);
    });

    return res.redirect(returnTo);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res() res: Response, @Req() req: Request) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.authService.logout(req.user);
    return res.json({ message: 'Logout success' });
  }
}
