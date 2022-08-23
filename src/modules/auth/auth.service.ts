import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RandomOTP } from 'src/utils/util.random';
import { MailService } from '../sendEmail/email.service';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/user.repo';
import { VerificationService } from '../verification/verification.service';
import { CreateUserDto } from './dto/create.dto';
import { UpdateDTO } from './dto/update.dto';
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
    this.mailService.sendMail(createUserDto, activeCode);
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
      { status: 'Active' },
    );
  }

  async userLogin(info: object): Promise<object> {
    const resultFindAccount = await this.userRepository.userLogin(info);
    if (!resultFindAccount) {
      throw new HttpException(
        {
          error: 'Username or password are not correct!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (resultFindAccount.status === 'Not Active') {
      throw new HttpException(
        {
          error: 'Please verify account before login!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const refreshToken = await this.jwtService.signAsync(
      {
        username: resultFindAccount.username,
      },
      { expiresIn: '50h' },
    );
    const accessToken = await this.jwtService.signAsync(
      {
        username: resultFindAccount.username,
      },
      { expiresIn: '10h' },
    );
    this.verificationService.saveToken(
      resultFindAccount.username,
      accessToken,
      refreshToken,
    );
    return [{ refreshToken, accessToken }];
  }

  async showInfo(username: object): Promise<User> {
    return this.userRepository.showInfo(username);
  }

  async updateInfo(id: object, param: UpdateDTO): Promise<User> {
    return this.userRepository.updateInfo(id, param);
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
