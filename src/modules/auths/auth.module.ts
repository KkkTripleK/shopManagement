import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { cacheModule } from '../cache/cache.module';
import { LocalStrategy } from '../strategies/strategy.guard.validate';
import { UserModule } from '../users/user.module';
import { VerificationEntity } from '../verifications/verification.entity';
import { VerificationModule } from '../verifications/verification.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    cacheModule,
    UserModule,
    VerificationModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([VerificationEntity]),
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, ConfigService],
})
export class AuthModule {}
