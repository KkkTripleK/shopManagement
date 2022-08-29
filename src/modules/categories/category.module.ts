import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { UserEntity } from '../users/user.entity';
import { UserRepository } from '../users/user.repo';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './category.entity';
import { CategoryRepository } from './category.repo';
import { CategoryService } from './category.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([CategoryEntity, UserEntity]),
    MulterModule,
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    VerifyToken,
    JwtService,
    UserRepository,
  ],
})
export class CategoryModule {}
