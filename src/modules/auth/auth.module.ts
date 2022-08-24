import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomOTP } from 'src/utils/util.random';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { MailService } from '../sendEmail/email.service';
import { LocalStrategy } from '../strategy/strategy.guard.validate';
import { UserEntity } from '../users/user.entity';
import { UserRepository } from '../users/user.repo';
import { VerificationEntity } from '../verification/verification.entity';
import { VerificationRepository } from '../verification/verification.repo';
import { VerificationService } from '../verification/verification.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserEntity, VerificationEntity]),
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    UserRepository,
    RandomOTP,
    VerificationService,
    VerificationRepository,
    LocalStrategy,
  ],
})
export class AuthModule {}
