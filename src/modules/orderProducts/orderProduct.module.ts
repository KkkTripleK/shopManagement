import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { CategoryModule } from '../categories/category.module';
import { OrderModule } from '../orders/order.module';
import { ProductEntity } from '../products/product.entity';
import { ProductRepository } from '../products/product.repo';
import { UserModule } from '../users/user.module';
import { OrderProductController } from './orderProduct.controller';
import { OrderProductEntity } from './orderProduct.entity';
import { OrderProductRepository } from './orderProduct.repo';
import { OrderProductService } from './orderProduct.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([OrderProductEntity, ProductEntity]),
        OrderModule,
        UserModule,
        // ProductModule,
        CategoryModule,
    ],
    controllers: [OrderProductController],
    providers: [OrderProductRepository, OrderProductService, ProductRepository],
    exports: [OrderProductService, OrderProductRepository],
})
export class OrderProductModule {}
