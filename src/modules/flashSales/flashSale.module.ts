import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/config.typeorm';
import { FlashSaleController } from './flashSale.controller';
import { FlashSaleEntity } from './flashSale.entity';
import { FlashSaleRepository } from './flashSale.repo';
import { FlashSaleService } from './flashSale.service';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([FlashSaleEntity])],
    controllers: [FlashSaleController],
    providers: [FlashSaleService, FlashSaleRepository],
    exports: [FlashSaleService],
})
export class CouponUserModule {}
