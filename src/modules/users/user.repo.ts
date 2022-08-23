import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create.dto';
import { UpdateDTO } from '../auth/dto/update.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      Number(process.env.PRIVATE_KEY),
    );
    const newUserInfo = await this.userRepo.save(createUserDto);
    return newUserInfo;
  }

  async userLogin(info: object): Promise<User> {
    return this.userRepo.findOne({ where: [info] });
  }

  async deleteItem(info: object): Promise<object> {
    return this.userRepo.delete(info);
  }

  async updateInfo(username: object, param: UpdateDTO): Promise<User> {
    const findInfo = await this.userRepo.findOneBy(username);
    console.log(findInfo);
    for (const key in param) {
      findInfo[key] = param[key];
    }
    return this.userRepo.save(findInfo);
  }

  async showInfo(username: object): Promise<User> {
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
