import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
@Processor('runningRequest')
export class MqConsumer {
  @Process('task')
  getMessageQueue(job: Job) {
    console.log('pop', job.id);
    console.log(job.data, '작업 완료!');
  }
}
