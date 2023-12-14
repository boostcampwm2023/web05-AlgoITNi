import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as cron from 'node-cron';
import { Worker } from 'worker_threads';
import * as path from 'path';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly configService: ConfigService,
  ) {}

  private cpuUsageQueue: number[] = [];
  private cpuWorker: Worker;
  private usages: number;

  onModuleInit() {
    this.initCpuWorker();
    this.scheduling();
  }

  private initCpuWorker() {
    this.cpuWorker = new Worker(path.join(__dirname, 'worker/cpu.worker.js'));
    this.cpuWorker.on('message', (cpuUsage: number) => {
      if (this.cpuUsageQueue.length >= 20) {
        this.cpuUsageQueue.shift();
      }
      this.cpuUsageQueue.push(cpuUsage);
      const sum = this.cpuUsageQueue.reduce((acc, val) => acc + val, 0);
      this.usages = sum / this.cpuUsageQueue.length;
    });
  }

  private scheduling() {
    cron.schedule('*/5 * * * *', () => {
      const message = {
        url: this.configService.get<string>('SOCKET_URL'),
        usages: this.usages,
      };
      this.client.publish('signalingCpu', JSON.stringify(message));
    });
  }
}
