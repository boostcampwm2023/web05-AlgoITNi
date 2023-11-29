import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private dataSource: Repository<Cat>,
  ) {}

  async bulkInsert() {
    return await this.dataSource.manager.transaction(
      async (entityManager: EntityManager) => {
        const cats = [];
        for (let i = 0; i < 100000; i++) {
          const cat = new Cat();
          cat.name = this.getRandomName();
          cat.age = this.getRandomAge().toString();
          cat.color = this.getRandomColor();
          cats.push(cat);
        }

        const batchSize = 1000;
        for (let i = 0; i < cats.length; i += batchSize) {
          const batch = cats.slice(i, i + batchSize);
          await entityManager
            .createQueryBuilder()
            .insert()
            .into(Cat)
            .values(batch)
            .execute();
        }

        return 'success';
      },
    );
  }

  async save() {
    return await this.dataSource.manager.transaction(
      async (entityManager: EntityManager) => {
        const cats = [];
        for (let i = 0; i < 100; i++) {
          const cat = new Cat();
          cat.name = this.getRandomName();
          cat.age = this.getRandomAge().toString();
          cat.color = this.getRandomColor();
          cats.push(cat);
        }

        await entityManager
          .createQueryBuilder()
          .insert()
          .into(Cat)
          .values(cats)
          .execute();
        return 'success';
      },
    );
  }

  async findAll(): Promise<Cat[]> {
    return await this.dataSource.find();
  }

  async findTop1000ByAge(): Promise<Cat[]> {
    return await this.dataSource.manager.transaction(
      async (entityManager: EntityManager) => {
        return entityManager.find(Cat, {
          order: {
            age: 'ASC',
          },
          take: 1000,
        });
      },
    );
  }

  async findTop1000ByName(): Promise<Cat[]> {
    return await this.dataSource.manager.transaction(
      async (entityManager: EntityManager) => {
        return entityManager.find(Cat, {
          order: {
            name: 'ASC',
          },
          take: 1000,
        });
      },
    );
  }

  getRandomName(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nameLength = Math.floor(Math.random() * 9) + 1;
    let result = '';
    for (let i = 0; i < nameLength; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  getRandomAge(): number {
    return Math.floor(Math.random() * 50) + 1;
  }

  getRandomColor(): string {
    const colors = ['black', 'white', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
