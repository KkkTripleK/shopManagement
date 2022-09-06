import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/config.typeorm';
import { CouponUserController } from './couponUser.controller';
import { CouponUserEntity } from './couponUser.entity';
import { CouponUserRepository } from './couponUser.repo';
import { CouponUserService } from './couponUser.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([CouponUserEntity]),
  ],
  controllers: [CouponUserController],
  providers: [CouponUserService, CouponUserRepository],
  exports: [CouponUserService, CouponUserRepository],
})
export class CouponUserModule {}
