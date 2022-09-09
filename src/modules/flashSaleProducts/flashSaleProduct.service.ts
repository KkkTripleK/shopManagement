import { Injectable } from '@nestjs/common';
import { createFlashSaleProductDto } from './dto/dto.create';
import { FlashSaleProductRepository } from './flashSaleProduct.repo';

@Injectable()
export class FlashSaleProductService {
    constructor(private flashSaleProductRepo: FlashSaleProductRepository) {}

    async createFlashSaleProduct(flashSaleProductInfo: createFlashSaleProductDto) {
        return this.flashSaleProductRepo.createFlashSaleProduct(flashSaleProductInfo);
    }

    async getFlashSaleProductByFlashSaleId(fk_FlashSaleId: string) {
        return this.flashSaleProductRepo.getFlashSaleProductByFlashSaleId(fk_FlashSaleId);
    }

    async updateFlashSaleProduct(fk_FlashSaleProductId: string, param: object) {
        return this.flashSaleProductRepo.updateFlashSaleProduct(fk_FlashSaleProductId, param);
    }
}
