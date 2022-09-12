import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { cacheModule } from '../cache/cache.module';
import { UserModule } from '../users/user.module';
import { CouponController } from './coupon.controller';
import { CouponEntity } from './coupon.entity';
import { CouponRepository } from './coupon.repo';
import { CouponService } from './coupon.service';
// import { CACHE_MANAGER } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([CouponEntity]), UserModule, cacheModule],
    controllers: [CouponController],
    providers: [CouponService, CouponRepository, JWTandRolesGuard],
    exports: [CouponService],
})
export class CouponModule {}
