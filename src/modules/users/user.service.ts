import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { userStatus } from 'src/commons/common.enum';
import { RandomOTP } from 'src/utils/util.random';
import { CacheService } from '../cache/cache.service';
import { MailService } from '../email/email.service';
import { ChangePasswordDto } from './dto/dto.changePassword';
import { UpdateDto } from './dto/dto.update';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private randomOTP: RandomOTP,
        private cacheService: CacheService,
        private mailService: MailService,
    ) {}

    async getListAccount(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
        return this.userRepository.getListAccount(options);
    }

    async findAccount(param: object): Promise<UserEntity> {
        try {
            const result = await this.userRepository.findAccount(param);
            if (result === null) {
                throw new BadRequestException('Can not find your account!');
            }
            return result;
        } catch (error) {
            throw new BadRequestException('Can not find your account!');
        }
    }

    async updateAccount(username: object, param: UpdateDto): Promise<UpdateDto> {
        return this.userRepository.updateAccount(username, param);
    }

    async deleteAccount(id: object) {
        await this.userRepository.updateAccount(id, {
            accountStatus: userStatus.REMOVED,
        });
    }

    async forgotPassword(username: string) {
        const userInfo = await this.findAccount({ username });
        const activeCode = this.randomOTP.randomOTP();
        this.mailService.sendMail(userInfo.email, activeCode);
        const newPassword = await bcrypt.hash(activeCode, Number(process.env.PRIVATE_KEY));
        await this.userRepository.updateAccount({ username }, { password: newPassword });
        await this.cacheService.del(`users:${username}:refreshToken`);
    }

    async changePassword(requestBody: ChangePasswordDto, username: object) {
        const oldPassword = requestBody.password;
        const newPassword = requestBody.newPassword;
        const userInfo = await this.findAccount(username);
        const isMatch = await bcrypt.compare(oldPassword, userInfo.password);
        if (!isMatch) {
            throw new BadRequestException('Old password is not correct!');
        }
        if (newPassword === oldPassword) {
            throw new BadRequestException('Old password and new password can not be the same!');
        }
        const newPasswordBcrypt = await bcrypt.hash(requestBody.newPassword, Number(process.env.PRIVATE_KEY));
        return this.userRepository.updateAccount({ username: userInfo.username }, { password: newPasswordBcrypt });
    }
}
