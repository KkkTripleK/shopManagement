import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { cacheModule } from '../cache/cache.module';
import { UserModule } from '../users/user.module';
import { FlashSaleController } from './flashSale.controller';
import { FlashSaleEntity } from './flashSale.entity';
import { FlashSaleRepository } from './flashSale.repo';
import { FlashSaleService } from './flashSale.service';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([FlashSaleEntity]),
        cacheModule,
    ],
    controllers: [FlashSaleController],
    providers: [FlashSaleService, FlashSaleRepository],
    exports: [FlashSaleService],
})
export class FlashSaleModule {}
