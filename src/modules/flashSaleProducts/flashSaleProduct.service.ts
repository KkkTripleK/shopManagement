import { Injectable } from '@nestjs/common';
import { createFlashSaleProductDto } from './dto/dto.create';
import { FlashSaleProductRepository } from './flashSaleProduct.repo';

@Injectable()
export class FlashSaleProductService {
    constructor(private flashSaleProductRepository: FlashSaleProductRepository) {}

    async createFlashSaleProduct(flashSaleProductInfo: createFlashSaleProductDto) {
        return this.flashSaleProductRepository.createFlashSaleProduct(flashSaleProductInfo);
    }
}
