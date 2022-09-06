import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/config.typeorm';
import { CategoryModule } from '../categories/category.module';
import { OrderModule } from '../orders/order.module';
import { ProductModule } from '../products/product.module';
import { UserModule } from '../users/user.module';
import { OrderProductController } from './orderProduct.controller';
import { OrderProductEntity } from './orderProduct.entity';
import { OrderProductRepository } from './orderProduct.repo';
import { OrderProductService } from './orderProduct.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([OrderProductEntity]),
    OrderModule,
    UserModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [OrderProductController],
  providers: [OrderProductRepository, OrderProductService],
  exports: [OrderProductService, OrderProductRepository],
})
export class OrderProductModule {}
