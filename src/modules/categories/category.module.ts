import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { UserModule } from '../users/user.module';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './category.entity';
import { CategoryRepository } from './category.repo';
import { CategoryService } from './category.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([CategoryEntity]),
        MulterModule,
        UserModule,
    ],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryRepository],
    exports: [CategoryRepository],
})
export class CategoryModule {}
