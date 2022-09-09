import { Injectable } from '@nestjs/common';
import { createFlashSaleDto } from './dto/dto.create';
import { updateFlashSaleDto } from './dto/dto.update';
import { FlashSaleRepository } from './flashSale.repo';

@Injectable()
export class FlashSaleService {
    constructor(private flashSaleRepo: FlashSaleRepository) {}

    async createFlashSale(flashSaleInfo: createFlashSaleDto) {
        return this.flashSaleRepo.createFlashSale(flashSaleInfo);
    }

    async getListFLashSale() {
        return this.flashSaleRepo.getListFlashSale();
    }

    async updateFlashSale(flashSaleId: string, param: updateFlashSaleDto) {
        return this.flashSaleRepo.updateFlashSale(flashSaleId, param);
    }
}
