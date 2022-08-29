import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomOTP } from 'src/utils/util.random';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { AuthService } from '../auths/auth.service';
import { CreateUserDto } from '../auths/dto/dto.create';
import { cacheModule } from '../cache/cache.module';
import { MailService } from '../email/email.service';
import { JwtStrategy } from '../strategies/strategy.guard.jwt';
import { VerificationEntity } from '../verifications/verification.entity';
import { VerificationRepository } from '../verifications/verification.repo';
import { VerificationService } from '../verifications/verification.service';
import { ChangePasswordDto } from './dto/dto.changePassword';
import { UpdateDto } from './dto/dto.update';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repo';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([VerificationEntity]),
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
    CreateUserDto,
    ChangePasswordDto,
    UpdateDto,
    JwtStrategy,
    AuthService,
    VerificationService,
    ConfigService,
    VerificationRepository,
  ],
})
export class UserModule {}
