import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class JwtServiceMock {
  // 실제 JwtService의 메서드들을 여기에 목업으로 구현
  signAsync(payload: any): string {
    return 'asdf.asdf.asdf';
  }
}

@Injectable()
export class RedisServiceMock {
  async storeRefreshToken(id, token) {}
  async delRefreshToken(id: number): Promise<void> {}
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: JwtService,
          useClass: JwtServiceMock,
        },
        {
          provide: RedisService,
          useClass: RedisServiceMock,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should set access_token cookie with the correct options', () => {
    const mockResponse: Partial<Response> = {
      cookie: jest.fn(), // cookie 메서드를 Jest mock 함수로 대체
    };
    // 테스트할 access_token 값
    const access_token = 'test-access-token';

    // 함수 호출
    service.setAccessToken(mockResponse as Response, access_token);

    // cookie 메서드가 올바른 매개변수와 함께 호출되었는지 확인
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'access_token',
      access_token,
      {
        httpOnly: true,
        path: '/',
        secure: true,
        expires: expect.any(Date), // calcCookieExpire에서 반환된 값이 Date 객체임을 확인
      },
    );
  });
});
