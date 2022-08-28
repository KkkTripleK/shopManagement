import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Payload } from 'src/utils/dto/dto.verifyToken';
import { RandomOTP } from 'src/utils/util.random';
import { CreateUserDto } from '../auths/dto/dto.create';
import { CacheService } from '../cache/cache.service';
import { MailService } from '../email/email.service';
import { ChangePasswordDTO } from './dto/dto.changePassword';
import { UpdateDTO } from './dto/dto.update';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private createUserDto: CreateUserDto,
    private randomOTP: RandomOTP,
    private cacheService: CacheService,
    private mailService: MailService,
  ) {}

  async getListUser(): Promise<UserEntity[]> {
    return this.userRepository.getAll();
  }

  async findAccount(username: object): Promise<UserEntity> {
    return this.userRepository.findAccount(username);
  }

  async updateAccount(username: object, param: UpdateDTO): Promise<UpdateDTO> {
    return this.userRepository.updateAccount(username, param);
  }

  async deleteAccount(id: object) {
    const account: any = await this.userRepository.deleteAccount(id);
    console.log(account);
    if (account.affected === 0) {
      throw new HttpException('ID is invalid!', HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword(username: string) {
    const userInfo = await this.findAccount({ username });
    const activeCode = this.randomOTP.randomOTP();
    this.mailService.sendMail(userInfo.email, activeCode);
    const newPassword = await bcrypt.hash(
      activeCode,
      Number(process.env.PRIVATE_KEY),
    );
    await this.userRepository.updateAccount(
      { username },
      { password: newPassword },
    );
    await this.cacheService.del(`users:${username}:refreshToken`);
  }

  async changePassword(requestBody: ChangePasswordDTO, payload: Payload) {
    const oldPassword = requestBody.password;
    const newPassword = requestBody.newPassword;
    const userInfo = await this.findAccount({
      username: payload.username,
    });
    const isMatch = await bcrypt.compare(oldPassword, userInfo.password);
    if (!isMatch) {
      throw new HttpException(
        'Old password is not correct!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (newPassword === oldPassword) {
      throw new HttpException(
        'Old password and new password can not be the same!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPasswordBcrypt = await bcrypt.hash(
      requestBody.newPassword,
      Number(process.env.PRIVATE_KEY),
    );
    return this.userRepository.updateAccount(
      { username: userInfo.username },
      { password: newPasswordBcrypt },
    );
  }
}

//   async getUserByID(id: number): Promise<User> {
//     const found = await this.userRepo.findOne(id);
//     if (!found) {
//       throw new NotFoundException(`Can not find user ${id} `);
//     }
//     return found;
//   }
//   async createUser(createUserDTO: CreateUserDto) {
//     const { name, age } = createUserDTO;
//     const user = new User();
//     user.fullName = name;
//     user.age = age;
//     await user.save();
//     return user;
//   }
