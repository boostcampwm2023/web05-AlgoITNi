import { Controller, Get, Post } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post('/init')
  async init() {
    return await this.catsService.bulkInsert();
  }

  @Post('/save')
  async create() {
    return await this.catsService.save();
  }

  @Get()
  async findAll() {
    return await this.catsService.findAll();
  }

  @Get('/byName')
  async findByName() {
    return await this.catsService.findTop1000ByName();
  }

  @Get('/byAge')
  async findByAge() {
    return await this.catsService.findTop1000ByAge();
  }
}
