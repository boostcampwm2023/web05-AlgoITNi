import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import {
  getLocalStorageRepository,
  Transactional,
} from '../common/transaction/transaction.decorator';
type OAUTH = 'github' | 'google';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  @Transactional('typeorm')
  async addUser(userDTO: UserDto, oauth: OAUTH) {
    const user = new UserEntity();
    user.name = userDTO.name;
    user.authServiceID = userDTO.authServiceID;
    user.oauth = oauth;
    const repository = getLocalStorageRepository(UserEntity);
    await repository.save<UserEntity>(user);
  }

  async findUser(userDTO: UserDto): Promise<UserEntity> {
    const find = await this.usersRepository.findOne({
      where: {
        authServiceID: userDTO.authServiceID,
      },
    });
    return find;
  }
}
