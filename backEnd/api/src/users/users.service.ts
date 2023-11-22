import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
type OAUTH = 'github' | 'google';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async addUser(userDTO: UserDto, oauth: OAUTH) {
    try {
      const user = new UserEntity();
      user.name = userDTO.name;
      user.authServiceID = userDTO.authServiceID;
      user.oauth = oauth;
      await this.usersRepository.save<UserDto>(user);
    } catch (e) {
      console.log(e);
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

  async delUser(userDTO: UserDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: {
        authServiceID: userDTO.authServiceID,
      },
    });
    user.isActive = false;
    await this.usersRepository.save<UserEntity>(user);
  }
}
