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
import { LoginDTO } from '../auth/dto/login.dto';
import { UpdateDTO } from './dto/update.dto';
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
        'Create new account failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async userLogin(info: LoginDTO): Promise<UserEntity> {
    const userInfo = await this.userRepo.findOne({
      where: [{ username: info.username }],
    });
    if (userInfo === null) {
      throw new HttpException('Username is not exist!', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await bcrypt.compare(info.password, userInfo.password);
    if (!isMatch) {
      throw new HttpException(
        'Password is not correct!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return userInfo;
  }

  async deleteItem(info: object): Promise<object> {
    return this.userRepo.delete(info);
  }

  async updateInfo(username: object, param: UpdateDTO): Promise<UserEntity> {
    const findInfo = await this.userRepo.findOneBy(username);
    for (const key in param) {
      findInfo[key] = param[key];
    }
    return this.userRepo.save(findInfo);
  }

  async showInfo(username: object): Promise<UserEntity> {
    const userInfo = await this.userRepo.findOne({ where: [username] });
    if (!userInfo) {
      throw new NotFoundException('Can not find username');
    }
    return userInfo;
  }

  async checkExistUser(createUserDto: CreateUserDto): Promise<number> {
    const username = createUserDto.username;
    return this.userRepo.count({ where: [{ username }] });
  }

  // async forgotPassword(username) {
  //   const userInfo = await this.showInfo(username);

  // }
}

//   async getUserByID(id: number): Promise<User> {
//     const found = await this.userRepo.findOne(id);
//     if (!found) {
//       throw new NotFoundException(`Can not find user ${id} `);
//     }
//     return found;
//   }