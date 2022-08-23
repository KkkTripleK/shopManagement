import {
  HttpException,
  HttpStatus,
  Injectable,
  // eslint-disable-next-line prettier/prettier
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create.dto';
import { UpdateDTO } from '../auth/dto/update.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  getAll(): Promise<UserEntity[]> {
    return this.userRepo.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        Number(process.env.PRIVATE_KEY),
      );
      const newUserInfo = await this.userRepo.save(createUserDto);
      return newUserInfo;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          error: 'Create new account failed!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async userLogin(info: object): Promise<UserEntity> {
    return this.userRepo.findOne({ where: [info] });
  }

  async deleteItem(info: object): Promise<object> {
    return this.userRepo.delete(info);
  }

  async updateInfo(username: object, param: UpdateDTO): Promise<UserEntity> {
    const findInfo = await this.userRepo.findOneBy(username);
    console.log(findInfo);
    for (const key in param) {
      findInfo[key] = param[key];
    }
    return this.userRepo.save(findInfo);
  }

  async showInfo(username: object): Promise<UserEntity> {
    const found = await this.userRepo.findOne({ where: username });
    if (!found) {
      throw new NotFoundException(`Can not find user ${username} `);
    }
    return found;
  }

  async checkExistUser(createUserDto: CreateUserDto): Promise<number> {
    const username = createUserDto.username;
    return this.userRepo.count({ where: [{ username }] });
  }
}

// const isMatch = await bcrypt.compare('passwordInput', user.password);

//   async getUserByID(id: number): Promise<User> {
//     const found = await this.userRepo.findOne(id);
//     if (!found) {
//       throw new NotFoundException(`Can not find user ${id} `);
//     }
//     return found;
//   }
