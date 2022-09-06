import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomOTP } from 'src/utils/util.random';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { AuthService } from '../auths/auth.service';
import { cacheModule } from '../cache/cache.module';
import { MailService } from '../email/email.service';
import { JwtStrategy } from '../strategies/strategy.guard.jwt';
import { VerificationModule } from '../verifications/verification.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repo';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([UserEntity]),
        VerificationModule,
        PassportModule,
        cacheModule,
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        VerifyToken,
        JwtService,
        RandomOTP,
        MailService,
        JwtStrategy,
        AuthService,
        ConfigService,
    ],
    exports: [UserRepository, VerifyToken, JwtService, MailService, RandomOTP],
})
export class UserModule {}
