import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import Redis from 'ioredis';
import { RedisModule, getRedisToken } from '@liaoliaots/nestjs-redis';
import { MessageDto } from './dto/message.dto';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatService;
  let redisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          config: {
            host: 'localhost',
            port: 6379,
          },
        }),
      ],
      providers: [ChatGateway, ChatService],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
    redisClient = module.get<Redis>(getRedisToken('default'));
  });

  afterEach(async () => {
    await redisClient.flushall();
  });

  describe('Redis', () => {
    it('레디스와 연결에 성공한다.', async () => {
      expect(redisClient).toBeDefined();
      const response = await redisClient.ping();
      expect(response).toBe('PONG');
    });
  });

  describe('sendMessage', () => {
    it('메시지를 보냈을때 room 정보가 없으면 예외가 발생한다.', async () => {
      //GIVEN
      const testMessageDto: MessageDto = {
        room: '',
        message: 'testMessage',
      };
      const testSocket = { id: '12345' } as unknown as Socket;

      // WHEN
      const messageHandling = gateway.handleMessage(testMessageDto, testSocket);

      // THEN
      await expect(messageHandling).rejects.toThrow(WsException);
    });

    it('메시지를 보냈을때 message 정보가 없으면 예외가 발생한다.', async () => {
      //GIVEN
      const testMessageDto: MessageDto = {
        room: 'testRoom',
        message: '',
      };
      const testSocket = { id: '12345' } as unknown as Socket;

      // WHEN
      const messageHandling = gateway.handleMessage(testMessageDto, testSocket);

      // THEN
      await expect(messageHandling).rejects.toThrow(WsException);
    });
  });
});
