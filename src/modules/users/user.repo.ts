import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auths/dto/dto.create';
import { UpdateDto } from './dto/dto.update';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async getListAccount(
    options: IPaginationOptions,
  ): Promise<Pagination<UserEntity>> {
    return paginate<UserEntity>(this.userRepo, options);
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
      throw new HttpException(
        'Create new account failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateAccount(username: object, param: UpdateDto): Promise<UserEntity> {
    const info = await this.userRepo.findOneBy(username);
    for (const key in param) {
      info[key] = param[key];
    }
    return this.userRepo.save(info);
  }

  async findAccount(param: object): Promise<UserEntity> {
    const userInfo = await this.userRepo.findOne({ where: [param] });
    return userInfo;
  }

  async checkExistUsername(createUserDto: CreateUserDto): Promise<number> {
    const username = createUserDto.username;
    return this.userRepo.count({ where: [{ username }] });
  }
}
