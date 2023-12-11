import { applyDecorators, SetMetadata } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ObjectLiteral, QueryRunner, Repository } from 'typeorm';

export const TRANSACTIONAL_KEY = Symbol('TRANSACTION');
export type ORM = 'typeorm' | 'mongoose';
export function Transactional(orm: ORM): MethodDecorator {
  return applyDecorators(SetMetadata(TRANSACTIONAL_KEY, orm));
}

export const queryRunnerLocalStorage = new AsyncLocalStorage<{
  qr: QueryRunner;
}>();

export function getLocalStorageRepository<T extends ObjectLiteral>(
  target,
): Repository<T> {
  const queryRunner = queryRunnerLocalStorage.getStore();
  return queryRunner?.qr?.manager.getRepository(target);
}
