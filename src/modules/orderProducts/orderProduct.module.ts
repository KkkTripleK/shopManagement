import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/config.typeorm';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { CategoryEntity } from '../categories/category.entity';
import { CategoryRepository } from '../categories/category.repo';
import { OrderEntity } from '../orders/order.entity';
import { OrderModule } from '../orders/order.module';
import { OrderRepository } from '../orders/order.repo';
import { OrderService } from '../orders/order.service';
import { ProductEntity } from '../products/product.entity';
import { ProductRepository } from '../products/product.repo';
import { ProductService } from '../products/product.service';
import { UserEntity } from '../users/user.entity';
import { UserRepository } from '../users/user.repo';
import { OrderProductController } from './orderProduct.controller';
import { OrderProductEntity } from './orderProduct.entity';
import { OrderProductRepository } from './orderProduct.repo';
import { OrderProductService } from './orderProduct.service';

@Module({
  imports: [
    OrderModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      OrderProductEntity,
      UserEntity,
      ProductEntity,
      CategoryEntity,
      OrderEntity,
    ]),
  ],
  controllers: [OrderProductController],
  providers: [
    VerifyToken,
    JwtService,
    UserRepository,
    OrderProductRepository,
    ProductRepository,
    CategoryRepository,
    ProductService,
    OrderProductService,
    OrderService,
    OrderRepository,
  ],
  exports: [OrderProductService],
})
export class OrderProductModule {}
