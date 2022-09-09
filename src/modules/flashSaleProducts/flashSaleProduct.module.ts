import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { FlashSaleProductController } from './flashSaleProduct.controller';
import { FlashSaleProductEntity } from './flashSaleProduct.entity';
import { FlashSaleProductRepository } from './flashSaleProduct.repo';
import { FlashSaleProductService } from './flashSaleProduct.service';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([FlashSaleProductEntity])],
    controllers: [FlashSaleProductController],
    providers: [FlashSaleProductService, FlashSaleProductRepository],
    exports: [FlashSaleProductService],
})
export class FlashSaleProductModule {}
