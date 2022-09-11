import { BadRequestException, Injectable } from '@nestjs/common';
import { createFlashSaleDto } from './dto/dto.create';
import { updateFlashSaleDto } from './dto/dto.update';
import { FlashSaleRepository } from './flashSale.repo';

@Injectable()
export class FlashSaleService {
    constructor(private flashSaleRepo: FlashSaleRepository) {}

    async createFlashSale(flashSaleInfo: createFlashSaleDto) {
        if (flashSaleInfo.flashSaleBegin >= flashSaleInfo.flashSaleEnd) {
            throw new BadRequestException('Time of FlashSaleBegin and FlashSaleEnd are incorrect!');
        }
        return this.flashSaleRepo.createFlashSale(flashSaleInfo);
    }

    async getListFLashSale() {
        return this.flashSaleRepo.getListFlashSale();
    }

    async getFlashSaleById(id: string) {
        try {
            const flashSaleInfo = await this.flashSaleRepo.getFlashSaleById(id);
            if (flashSaleInfo === null) {
                throw new BadRequestException('FlashSale ID is invalid!');
            }
        } catch (error) {
            throw new BadRequestException('FlashSale ID is invalid!');
        }
    }

    async updateFlashSale(flashSaleId: string, param: updateFlashSaleDto) {
        return this.flashSaleRepo.updateFlashSale(flashSaleId, param);
    }
}
