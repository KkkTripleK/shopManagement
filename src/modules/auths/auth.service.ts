import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { userStatus } from 'src/commons/common.enum';
import { RandomOTP } from 'src/utils/util.random';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { CacheService } from '../cache/cache.service';
import { MailService } from '../email/email.service';
import { UserEntity } from '../users/user.entity';
import { UserRepository } from '../users/user.repo';
import { VerificationService } from '../verifications/verification.service';
import { CreateUserDto } from './dto/dto.create';
import { VerifyDTO } from './dto/dto.verify';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private mailService: MailService,
        private randomOTP: RandomOTP,
        private verificationService: VerificationService,
        private jwtService: JwtService,
        private verifyToken: VerifyToken,
        private cacheService: CacheService,
    ) {}

    async checkExistUsername(createUserDto: CreateUserDto): Promise<number> {
        return this.userRepository.checkExistUsername(createUserDto);
    }

    async checkExistEmail(createUserDto: CreateUserDto): Promise<number> {
        return this.userRepository.checkExistEmail(createUserDto);
    }

    async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
        const findExistUser = await this.checkExistUsername(createUserDto);
        if (findExistUser) {
            throw new BadRequestException('Username already exist!');
        }

        const findExistEmail = await this.checkExistEmail(createUserDto);
        if (findExistEmail) {
            throw new BadRequestException('Email already exist!');
        }

        const activeCode = this.randomOTP.randomOTP();
        this.mailService.sendMail(createUserDto.email, activeCode);
        await this.verificationService.saveActiveCode(createUserDto.username, activeCode);
        return this.userRepository.createUser(createUserDto);
    }

    async verifyUser(verifyDTO: VerifyDTO): Promise<void> {
        const resultVerifyUser = await this.verificationService.verifyUser(verifyDTO);
        if (!resultVerifyUser) {
            throw new BadRequestException('Username or activeCode is not correct!');
        }
        this.userRepository.updateAccount({ username: verifyDTO.username }, { accountStatus: userStatus.ACTIVE });
    }

    async userLogin(username: string): Promise<object> {
        const accessToken = await this.createToken(username, process.env.ACCESS_TOKEN_TTL);
        const refreshToken = await this.createToken(username, process.env.REFRESH_TOKEN_TTL);
        await this.cacheService.set(
            `users:${username}:accessToken`,
            accessToken,
            Number(process.env.CACHE_ACCESS_TOKEN_TTL),
        );
        await this.cacheService.set(
            `users:${username}:refreshToken`,
            refreshToken,
            Number(process.env.CACHE_REFRESH_TOKEN_TTL),
        );
        return [{ refreshToken, accessToken }];
    }

    async validateUser(username: object, password: string): Promise<UserEntity> {
        const userInfo = await this.userRepository.findAccount(username);
        if (userInfo === null) {
            throw new HttpException('Username is not exist!', HttpStatus.BAD_REQUEST);
        }
        const isMatch = await bcrypt.compare(password, userInfo.password);
        if (!isMatch) {
            throw new HttpException('Password is not correct!', HttpStatus.BAD_REQUEST);
        }
        if (userInfo.accountStatus === 'Not Active') {
            throw new HttpException('Please verify account before login!', HttpStatus.BAD_REQUEST);
        }
        return userInfo;
    }

    async regenerateToken(refreshToken: string): Promise<any> {
        const payload = await this.verifyToken.verifyTokenWithoutBearer(refreshToken);
        const refreshTokenRedis = await this.cacheService.get(`users:${payload.username}:refreshToken`);
        if (refreshToken !== refreshTokenRedis) {
            throw new HttpException('Refresh token is invalid!', HttpStatus.BAD_REQUEST);
        }
        const newAccessToken = await this.createToken(payload.username, process.env.ACCESS_TOKEN_TTL);
        return { newAccessToken };
    }

    async userLogout(username: string): Promise<any> {
        await this.cacheService.del(`users:${username}:refreshToken`);
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
