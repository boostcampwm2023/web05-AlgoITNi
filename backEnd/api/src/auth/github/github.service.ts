import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserDto } from '../../users/dto/user.dto';

@Injectable()
export class GithubService {
  private readonly authUrl;
  private readonly clientID;
  private readonly clientSecret;
  constructor(private configService: ConfigService) {
    const authPath = `https://github.com/login/oauth/authorize`;
    this.clientID = this.configService.get<string>('CLIENT_ID_GITHUB');
    this.clientSecret = this.configService.get<string>('CLIENT_SECRET_GITHUB');
    this.authUrl = `${authPath}?scope=user&client_id=${this.clientID}`;
  }
  getAuthUrl() {
    return this.authUrl;
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
    const user = new UserDto();
    user.name = githubUser.data.name;
    user.authServiceID = githubUser.data.login;
    return user;
  }
}
