import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RandomOTP } from 'src/utils/util.random';
import { MailService } from '../sendEmail/email.service';
import { UserRepository } from '../users/user.repo';
import { VerificationService } from '../verification/verification.service';
import { CreateUserDto } from './dto/create.dto';
import { LoginDTO } from './dto/login.dto';
import { VerifyDTO } from './dto/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private randomOTP: RandomOTP,
    private verificationService: VerificationService,
    private jwtService: JwtService,
  ) {}
  // constructor(
  //   @InjectRepository(User)
  //   private userRepo: Repository<User>,
  // ) {}

  // getAll(): Promise<User[]> {
  //   return this.userRepo.find();
  // }
  // // CRUD
  async checkExistUser(createUserDto: CreateUserDto): Promise<number> {
    return this.userRepository.checkExistUser(createUserDto);
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const findExistUser = await this.checkExistUser(createUserDto);
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

  async userLogin(info: LoginDTO): Promise<object> {
    const userInfo = await this.userRepository.showInfo({
      username: info.username,
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
    if (userInfo.accountStatus === 'Not Active') {
      throw new HttpException(
        'Please verify account before login!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const refreshToken = await this.createToken(userInfo.username, '50h');
    const accessToken = await this.createToken(userInfo.username, '10m');
    this.verificationService.saveToken(
      userInfo.username,
      accessToken,
      refreshToken,
    );
    return [{ refreshToken, accessToken }];
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
