import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import Redis from 'ioredis';
import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { MessageDto } from './dto/message.dto';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { MockSocket, createRedisTestingModule } from '../commons/testUtils';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatService;
  let redisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [createRedisTestingModule()],
      providers: [ChatGateway, ChatService],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
    redisClient = module.get<Redis>(getRedisToken('default'));

    await redisClient.flushall();
  });

  describe('Redis', () => {
    it('레디스와 연결에 성공한다.', async () => {
      expect(redisClient).toBeDefined();
      const response = await redisClient.ping();
      expect(response).toBe('PONG');
    });
  });

  describe('JOIN_ROOM', () => {
    it('클라이언트가 방에 참여하면 방이 생성된다.', async () => {
      //GIVEN
      const mockSockets = [
        new MockSocket('1'),
        new MockSocket('2'),
        new MockSocket('3'),
        new MockSocket('4'),
      ];

      //WHEN
      mockSockets
        .slice(0, 3)
        .forEach((socket) =>
          gateway.handleJoin({ room: 'ABC' }, socket as unknown as Socket),
        );
      gateway.handleJoin({ room: 'DEF' }, mockSockets[3] as unknown as Socket);

      //THEN
      //HAPPY PATH
      expect(gateway.getRoomCount('ABC')).toBe(3);
      expect(gateway.getRoomCount('DEF')).toBe(1);
      //EDGE CASE
      expect(gateway.getRoomCount('GHI')).toBe(0);
    });
  });

  describe('SEND_MESSAGE', () => {
    it('메시지를 보냈을때 room 정보가 없으면 예외가 발생한다.', async () => {
      //GIVEN
      const testMessageDto: MessageDto = {
        room: '',
        message: 'testMessage',
        nickname: 'testNickname',
        ai: false,
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
        nickname: 'testNickname',
        ai: false,
      };
      const testSocket = { id: '12345' } as unknown as Socket;

      // WHEN
      const messageHandling = gateway.handleMessage(testMessageDto, testSocket);

      // THEN
      await expect(messageHandling).rejects.toThrow(WsException);
    });

    it('메시지를 보냈을때 nickname 정보가 없으면 예외가 발생한다.', async () => {
      //GIVEN
      const testMessageDto: MessageDto = {
        room: 'testRoom',
        message: 'testMessage',
        nickname: '',
        ai: false,
      };
      const testSocket = { id: '12345' } as unknown as Socket;

      // WHEN
      const messageHandling = gateway.handleMessage(testMessageDto, testSocket);

      // THEN
      await expect(messageHandling).rejects.toThrow(WsException);
    });
  });
});
