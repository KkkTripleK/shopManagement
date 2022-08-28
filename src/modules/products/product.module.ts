import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { UserEntity } from '../users/user.entity';
import { UserRepository } from '../users/user.repo';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repo';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([ProductEntity, UserEntity]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    VerifyToken,
    JwtService,
    UserRepository,
  ],
})
export class ProductModule {}
