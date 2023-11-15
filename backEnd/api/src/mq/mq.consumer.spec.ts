import { MqConsumer } from './mq.consumer';

describe('QueueConsumer', () => {
  it('should be defined', () => {
    expect(new MqConsumer()).toBeDefined();
  });
});
