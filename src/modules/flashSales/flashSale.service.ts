import { Injectable } from '@nestjs/common';
import { createFlashSaleDto } from './dto/dto.create';
import { FlashSaleRepository } from './flashSale.repo';

@Injectable()
export class FlashSaleService {
    constructor(private flashSaleRepo: FlashSaleRepository) {}

    async createFlashSale(flashSaleInfo: createFlashSaleDto) {
        return this.flashSaleRepo.createFlashSale(flashSaleInfo);
    }
}
