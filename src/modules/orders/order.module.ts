import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { cacheModule } from '../cache/cache.module';
import { CategoryModule } from '../categories/category.module';
import { CouponModule } from '../coupons/coupon.module';
import { FlashSaleProductModule } from '../flashSaleProducts/flashSaleProduct.module';
import { OrderProductModule } from '../orderProducts/orderProduct.module';
import { ProductEntity } from '../products/product.entity';
import { ProductRepository } from '../products/product.repo';
import { UserModule } from '../users/user.module';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repo';
import { OrderService } from './order.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([OrderEntity, ProductEntity]),
        CategoryModule,
        UserModule,
        CouponModule,
        FlashSaleProductModule,
        cacheModule,
        forwardRef(() => OrderProductModule),
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository, ProductRepository],
    exports: [OrderService, OrderRepository],
})
export class OrderModule {}
