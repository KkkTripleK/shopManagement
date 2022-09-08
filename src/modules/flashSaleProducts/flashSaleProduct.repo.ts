import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createFlashSaleProductDto } from './dto/dto.create';
import { FlashSaleProductEntity } from './flashSaleProduct.entity';

@Injectable()
export class FlashSaleProductRepository {
    constructor(
        @InjectRepository(FlashSaleProductEntity)
        private flashSaleProductRepo: Repository<FlashSaleProductEntity>,
    ) {}

    async createFlashSaleProduct(flashSaleProductInfo: createFlashSaleProductDto) {
        console.log(flashSaleProductInfo);
        return this.flashSaleProductRepo.save(flashSaleProductInfo);
    }
}
