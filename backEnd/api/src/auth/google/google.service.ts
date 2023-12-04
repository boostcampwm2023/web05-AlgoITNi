import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { UserDto } from '../../users/dto/user.dto';

@Injectable()
export class GoogleService {
  private oauth2Client;
  private authorizationUrl;
  private scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];
  private client;
  private client_id;

  constructor(private configService: ConfigService) {
    this.client_id = this.configService.get<string>('CLIENT_ID_GOOGLE');
    this.oauth2Client = new google.auth.OAuth2(
      this.client_id,
      this.configService.get<string>('CLIENT_SECRET_GOOGLE'),
      `${this.configService.get<string>('API_DOMAIN')}/auth/google-callback`,
    );

    this.authorizationUrl = this.oauth2Client.generateAuthUrl({
      scope: this.scopes,
      include_granted_scopes: true,
    });

    this.client = new OAuth2Client();
  }

  getAuthUrl() {
    return this.authorizationUrl;
  }

  async getIDToken(code): Promise<string> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens.id_token;
  }

  async getUserInfo(id_token): Promise<UserDto> {
    const ticket = await this.client.verifyIdToken({
      idToken: id_token,
      audience: this.client_id,
    });
    const payload = ticket.getPayload();
    const user = new UserDto();
    user.name = payload.name;
    user.authServiceID = payload.email;
    return user;
  }
}
