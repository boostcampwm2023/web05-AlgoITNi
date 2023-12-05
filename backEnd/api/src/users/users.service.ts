import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { TransactionRollback } from '../common/exception/exception';
type OAUTH = 'github' | 'google';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async addUser(userDTO: UserDto, oauth: OAUTH) {
    const user = new UserEntity();
    user.name = userDTO.name;
    user.authServiceID = userDTO.authServiceID;
    user.oauth = oauth;

    const qr = this.getQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();
      await qr.manager.save<UserEntity>(user);
      await qr.commitTransaction();
    } catch (e) {
      console.log(e);
      await qr.rollbackTransaction();
      throw new TransactionRollback();
    } finally {
      await qr.release();
    }
  }

  async findUser(userDTO: UserDto): Promise<UserEntity> {
    const find = await this.usersRepository.findOne({
      where: {
        authServiceID: userDTO.authServiceID,
      },
    });
    return find;
  }

  getQueryRunner() {
    const dataSource = this.usersRepository.manager.connection;
    return dataSource.createQueryRunner();
  }
}
