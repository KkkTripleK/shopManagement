import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { cacheModule } from '../cache/cache.module';
import { CategoryModule } from '../categories/category.module';
import { FlashSaleModule } from '../flashSales/flashSale.module';
import { ProductEntity } from '../products/product.entity';
import { ProductRepository } from '../products/product.repo';
import { UserModule } from '../users/user.module';
import { FlashSaleProductController } from './flashSaleProduct.controller';
import { FlashSaleProductEntity } from './flashSaleProduct.entity';
import { FlashSaleProductRepository } from './flashSaleProduct.repo';
import { FlashSaleProductService } from './flashSaleProduct.service';

@Module({
    imports: [
        FlashSaleModule,
        UserModule,
        CategoryModule,
        cacheModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([FlashSaleProductEntity, ProductEntity]),
    ],
    controllers: [FlashSaleProductController],
    providers: [FlashSaleProductService, FlashSaleProductRepository, ProductRepository],
    exports: [FlashSaleProductService],
})
export class FlashSaleProductModule {}
