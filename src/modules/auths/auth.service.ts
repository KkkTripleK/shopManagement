import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RandomOTP } from 'src/utils/util.random';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { MailService } from '../email/email.service';
import { UserRepository } from '../users/user.repo';
import { VerificationService } from '../verifications/verification.service';
import { CreateUserDto } from './dto/create.dto';
import { VerifyDTO } from './dto/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private randomOTP: RandomOTP,
    private verificationService: VerificationService,
    private jwtService: JwtService,
    private verifyToken: VerifyToken,
  ) {}

  async checkExistUsername(createUserDto: CreateUserDto): Promise<number> {
    return this.userRepository.checkExistUsername(createUserDto);
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const findExistUser = await this.checkExistUsername(createUserDto);
    if (findExistUser) {
      throw new HttpException(
        {
          error: 'Username already exist!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const activeCode = this.randomOTP.randomOTP();
    this.mailService.sendMail(createUserDto.email, activeCode);
    await this.verificationService.saveActiveCode(
      createUserDto.username,
      activeCode,
    );
    return this.userRepository.createUser(createUserDto);
  }

  async verifyUser(verifyDTO: VerifyDTO): Promise<void> {
    const resultVerifyUser = await this.verificationService.verifyUser(
      verifyDTO,
    );
    if (!resultVerifyUser) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Username or activeCode is not correct!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    this.userRepository.updateInfo(
      { username: verifyDTO.username },
      { accountStatus: 'Active' },
    );
  }

  async userLogin(username: string): Promise<object> {
    const refreshToken = await this.createToken(username, '50h');
    const accessToken = await this.createToken(username, '10m');
    this.verificationService.saveToken(username, accessToken, refreshToken);
    return [{ refreshToken, accessToken }];
  }

  async validateUser(username: string, password: string) {
    const userInfo = await this.userRepository.findInfo({ username });
    if (userInfo === null) {
      throw new HttpException('Username is not exist!', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await bcrypt.compare(password, userInfo.password);
    if (!isMatch) {
      throw new HttpException(
        'Password is not correct!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (userInfo.accountStatus === 'Not Active') {
      throw new HttpException(
        'Please verify account before login!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return userInfo;
  }

  async regenerateToken(refreshToken: string): Promise<any> {
    const payload = await this.verifyToken.verifyTokenWithoutBearer(
      refreshToken,
    );
    return this.createToken(payload.username, '10m');
  }

  createToken(username: string, expiresTime: string) {
    return this.jwtService.signAsync(
      {
        username: username,
      },
      { expiresIn: expiresTime },
    );
  }
}
// deleteItem(info: object): Promise<object> {
//   return this.userRepo.delete(info);
// }

// async getUserByID(id: string): Promise<User> {
//   const found = await this.userRepo.findOne({ where: { id } });
//   if (!found) {
//     throw new NotFoundException(`Can not find user ${id} `);
//   }
//   return found;
// }
// // End CRUD
// const isMatch = await bcrypt.compare('passwordInput', user.password);

//   async getUserByID(id: number): Promise<User> {
//     const found = await this.userRepo.findOne(id);
//     if (!found) {
//       throw new NotFoundException(`Can not find user ${id} `);
//     }
//     return found;
//   }
