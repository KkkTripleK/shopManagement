import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create.dto';
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

  // async validateUser(info: LoginDTO): Promise<UserEntity> {
  //   const userInfo = await this.userRepo.findOne({
  //     where: [{ username: info.username }],
  //   });
  //   if (userInfo === null) {
  //     throw new HttpException('Username is not exist!', HttpStatus.BAD_REQUEST);
  //   }
  //   const isMatch = await bcrypt.compare(info.password, userInfo.password);
  //   if (!isMatch) {
  //     throw new HttpException(
  //       'Password is not correct!',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   return userInfo;
  // }

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

  async findInfo(username: object): Promise<UserEntity> {
    const userInfo = await this.userRepo.findOne({ where: [username] });
    return userInfo;
  }

  async checkExistUsername(createUserDto: CreateUserDto): Promise<number> {
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
// @Patch('/info')
// async updateInfo(@Body() param: UpdateDTO): Promise<UserEntity> {
//   const username = 'hoaNK97122';
//   console.log(param);
//   return await this.authService.updateInfo({ username }, param);
// }

// @Delete('remove')
// userDelete(@Body() removeID: DeleteUser): Promise<object> {
//   return this.authService.deleteItem(removeID);
// }

// @Patch('update')
// update(@Body() param: UpdateDTO): Promise<UpdateDTO> {
//   console.log(param);
//   return this.authService.updateInfo({ id: '10' }, param);
// }

// @Get('sendMail')
// sendMail(): void {
//   return this.mailService.example();
// }

// @Get(':id')
// getUserByID(@Param('id') id: string): Promise<object> {
//   return this.authService.getUserByID(id);
// }

// @Get('/:id')
// getUserByID(@Param('id', ParseIntPipe) id: number): Promise<User> {
//   return this.authService.getUserByID(id);
// }
