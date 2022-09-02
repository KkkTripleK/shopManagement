import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/config.typeorm';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { UserEntity } from '../users/user.entity';
import { UserRepository } from '../users/user.repo';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repo';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([OrderEntity, UserEntity]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    VerifyToken,
    JwtService,
    UserRepository,
  ],
})
export class OrderModule {}
