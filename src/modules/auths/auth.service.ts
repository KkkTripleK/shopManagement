import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { VerifyToken } from '../..//utils/util.verifyToken';
import { userStatus } from '../../commons/common.enum';
import { RandomOTP } from '../../utils/util.random';
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
            throw new BadRequestException('Username is not exist!');
        }
        const isMatch = await bcrypt.compare(password, userInfo.password);
        if (!isMatch) {
            throw new BadRequestException('Password is not correct!');
        }
        if (userInfo.accountStatus === 'Not Active') {
            throw new BadRequestException('Please verify account before login!');
        }
        return userInfo;
    }

    async regenerateToken(refreshToken: string): Promise<any> {
        const payload = await this.verifyToken.verifyTokenWithoutBearer(refreshToken);
        const refreshTokenRedis = await this.cacheService.get(`users:${payload.username}:refreshToken`);
        if (refreshToken !== refreshTokenRedis) {
            throw new BadRequestException('Refresh token is invalid!');
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
