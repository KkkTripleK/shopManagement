import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomOTP } from 'src/utils/util.random';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { CreateUserDto } from '../auths/dto/create.dto';
import { cacheModule } from '../cache/cache.module';
import { MailService } from '../email/email.service';
import { JwtStrategy } from '../strategies/strategy.guard.jwt';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repo';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserEntity]),
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
    JwtStrategy,
  ],
})
export class UserModule {}
