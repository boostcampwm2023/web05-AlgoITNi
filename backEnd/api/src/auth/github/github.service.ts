import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserDto } from '../../users/dto/user.dto';

@Injectable()
export class GithubService {
  private readonly clientID;
  private readonly authUrl = `https://github.com/login/oauth/authorize`;
  private readonly clientSecret;
  constructor(private configService: ConfigService) {
    this.clientID = this.configService.get<string>('CLIENT_ID');
    this.clientSecret = this.configService.get<string>('CLIENT_SECRET');
  }
  async authProxy() {
    const response = await axios.get(this.authUrl, {
      params: {
        client_id: this.clientID,
        scope: 'user',
      },
    });
    return response.request.res.responseUrl;
  }

  async getGithubAccessToken(code) {
    const data = {
      client_id: this.clientID,
      client_secret: this.clientSecret,
      code: code,
    };
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      data,
      { headers: { accept: 'application/json' } },
    );
    return response.data.access_token;
  }

  async getUserInfo(accessToken): Promise<UserDto> {
    const githubUser = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const member = new UserDto();
    member.name = githubUser.data.name;
    member.authServiceID = githubUser.data.login;
    return member;
  }
}
