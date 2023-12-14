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
  async getUserAfterAddUser(
    userDTO: UserDto,
    oauth: OAUTH,
  ): Promise<UserEntity> {
    const user = new UserEntity();
    user.name = userDTO.name;
    user.authServiceID = userDTO.authServiceID;
    user.oauth = oauth;
    const repository = getLocalStorageRepository(UserEntity);
    await repository.save<UserEntity>(user);

    const find = await repository.findOne({
      where: {
        authServiceID: userDTO.authServiceID,
      },
    });
    return find as UserEntity;
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
