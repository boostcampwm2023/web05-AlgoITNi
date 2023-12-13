import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TransactionService } from './transaction.service';

@Module({
  imports: [DiscoveryModule],
  providers: [TransactionService],
})
export class TransactionModule {}
