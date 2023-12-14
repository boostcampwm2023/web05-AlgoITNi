import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { WsException } from '@nestjs/websockets';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateRoom', () => {
    it('방 이름을 입력하면 예외가 발생하지 않는다.', () => {
      expect(() => service.validateRoom('room1')).not.toThrow();
    });

    it('방 이름을 입력하지 않으면 예외가 발생한다.', () => {
      expect(() => service.validateRoom('')).toThrow(WsException);
    });
  });

  describe('validateMessage', () => {
    it('메시지를 입력하면 예외가 발생하지 않는다.', () => {
      expect(() => service.validateMessage('message1')).not.toThrow();
    });

    it('메시지를 입력하지 않으면 예외가 발생한다.', () => {
      expect(() => service.validateMessage('')).toThrow(WsException);
    });
  });
});
