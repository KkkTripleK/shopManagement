import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/config.typeorm';
import { JWTandRolesGuard } from 'src/guards/guard.roles';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { UserModule } from '../users/user.module';
import { CouponController } from './coupon.controller';
import { CouponEntity } from './coupon.entity';
import { CouponRepository } from './coupon.repo';
import { CouponService } from './coupon.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([CouponEntity]),
  ],
  controllers: [CouponController],
  providers: [
    CouponService,
    CouponRepository,
    VerifyToken,
    JwtService,
    JWTandRolesGuard,
  ],
  exports: [CouponService],
})
export class CouponModule {}
