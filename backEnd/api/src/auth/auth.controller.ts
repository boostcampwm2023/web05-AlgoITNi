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
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { UserDto } from '../users/dto/user.dto';
import * as path from 'path';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private githubService: GithubService,
    private googleService: GoogleService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get('google')
  async googleProxy(
    @Res() res: Response,
    @Req() req: Request,
    @Query('next') next: string = '/',
    @Query('dev') dev: boolean = false,
  ) {
    req.session['returnTo'] = this.getRedirectionPath(dev, next);
    req.session.save((err) => {
      if (err) this.logger.log(err);
    });
    const redirectUrl = this.googleService.getAuthUrl();
    return res.redirect(redirectUrl);
  }

  @Get('google-callback')
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    const id_token: string = await this.googleService.getIDToken(code);
    const user: UserDto = await this.googleService.getUserInfo(id_token);
    let findUser = await this.userService.findUser(user);
    this.logger.error(JSON.stringify(findUser));
    if (findUser === null) {
      findUser = await this.userService.getUserAfterAddUser(user, 'google');
    }
    this.logger.error(JSON.stringify(findUser));

    const returnTo: string = await this.authService.login(findUser, res, req);
    return res.redirect(returnTo);
  }

  @Get('github')
  async githubProxy(
    @Res() res: Response,
    @Req() req: Request,
    @Query('next') next: string = '/',
    @Query('dev') dev: boolean = false,
  ) {
    req.session['returnTo'] = this.getRedirectionPath(dev, next);
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
    const user: UserDto = await this.githubService.getUserInfo(accessToken);
    let findUser = await this.userService.findUser(user);
    this.logger.error(JSON.stringify(findUser));
    if (findUser === null) {
      findUser = await this.userService.getUserAfterAddUser(user, 'github');
    }
    this.logger.error(JSON.stringify(findUser));

    const returnTo: string = await this.authService.login(findUser, res, req);

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

  @Get('dev')
  async devToken(@Res() res: Response) {
    const token = await this.authService.getDevToken();
    res.setHeader('Authorization', `Bearer ${token}`).send();
  }

  getRedirectionPath(dev: boolean, next: string) {
    return dev
      ? `http://${path.join('localhost:3000', next)}`
      : `https://${path.join('algoitni.site', next)}`;
  }
}
