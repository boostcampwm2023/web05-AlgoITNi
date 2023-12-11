import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import {
  ORM,
  queryRunnerLocalStorage,
  TRANSACTIONAL_KEY,
} from './transaction.decorator';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  onModuleInit(): any {
    const providers = this.discoveryService.getProviders();

    const instances = providers
      .filter((v) => v.isDependencyTreeStatic())
      .filter(({ metatype, instance }) => {
        return !(!metatype || !instance);
      })
      .map(({ instance }) => instance);

    instances.map((instance) => {
      const names = this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instance),
      );
      for (const name of names) {
        const originalMethod = instance[name];
        const metadata = this.reflector.get<ORM>(
          TRANSACTIONAL_KEY,
          originalMethod,
        );
        switch (metadata) {
          case 'typeorm':
            instance[name] = this.typeormTransaction(originalMethod, instance);
            return;
          case 'mongoose':
            instance[name] = this.mongooseTransaction(originalMethod, instance);
        }
      }
    });
  }

  typeormTransaction(originalMethod, instance) {
    const dataSource = this.dataSource;
    return async function (...args: any[]) {
      const qr = await dataSource.createQueryRunner();

      await queryRunnerLocalStorage.run({ qr }, async function () {
        try {
          await qr.startTransaction();
          const result = await originalMethod.apply(instance, args);
          await qr.commitTransaction();
          return result;
        } catch (error) {
          await qr.rollbackTransaction();
          throw error;
        } finally {
          await qr.release();
        }
      });
    };
  }

  mongooseTransaction(originalMethod, instance) {}
}
