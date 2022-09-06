import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/config.typeorm';
import { JWTandRolesGuard } from 'src/guards/guard.roles';
import { UserModule } from '../users/user.module';
import { CouponController } from './coupon.controller';
import { CouponEntity } from './coupon.entity';
import { CouponRepository } from './coupon.repo';
import { CouponService } from './coupon.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([CouponEntity]),
    UserModule,
  ],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository, JWTandRolesGuard],
  exports: [CouponService],
})
export class CouponModule {}
