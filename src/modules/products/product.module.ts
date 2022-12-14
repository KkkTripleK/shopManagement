import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { cacheModule } from '../cache/cache.module';
import { CategoryModule } from '../categories/category.module';
import { FlashSaleProductModule } from '../flashSaleProducts/flashSaleProduct.module';
import { FlashSaleModule } from '../flashSales/flashSale.module';
import { OrderProductModule } from '../orderProducts/orderProduct.module';
import { OrderModule } from '../orders/order.module';
import { UserModule } from '../users/user.module';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repo';
import { ProductService } from './product.service';

@Module({
    imports: [
        OrderModule,
        UserModule,
        CategoryModule,
        OrderProductModule,
        FlashSaleModule,
        FlashSaleProductModule,
        cacheModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([ProductEntity]),
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
    exports: [ProductService, ProductRepository],
})
export class ProductModule {}
