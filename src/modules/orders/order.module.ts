import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/config.typeorm';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { CategoryEntity } from '../categories/category.entity';
import { CategoryRepository } from '../categories/category.repo';
import { OrderProductEntity } from '../orderProducts/orderProduct.entity';
import { OrderProductModule } from '../orderProducts/orderProduct.module';
import { OrderProductRepository } from '../orderProducts/orderProduct.repo';
import { ProductEntity } from '../products/product.entity';
import { ProductRepository } from '../products/product.repo';
import { UserEntity } from '../users/user.entity';
import { UserRepository } from '../users/user.repo';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repo';
import { OrderService } from './order.service';

@Module({
  imports: [
    forwardRef(() => OrderProductModule),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      OrderEntity,
      UserEntity,
      ProductEntity,
      CategoryEntity,
      OrderProductEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    VerifyToken,
    JwtService,
    UserRepository,
    CategoryRepository,
    OrderProductRepository,
    ProductRepository,
  ],
  exports: [OrderService],
})
export class OrderModule {}
