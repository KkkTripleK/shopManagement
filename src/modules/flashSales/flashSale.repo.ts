import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createFlashSaleDto } from './dto/dto.create';
import { updateFlashSaleDto } from './dto/dto.update';
import { FlashSaleEntity } from './flashSale.entity';

@Injectable()
export class FlashSaleRepository {
    constructor(
        @InjectRepository(FlashSaleEntity)
        private flashSaleRepo: Repository<FlashSaleEntity>,
    ) {}

    async createFlashSale(flashSaleInfo: createFlashSaleDto) {
        return this.flashSaleRepo.save(flashSaleInfo);
    }

    async getListFlashSale() {
        return this.flashSaleRepo.find();
    }

    async getFlashSaleById(id: string) {
        return this.flashSaleRepo.findOne({ where: [{ id }] });
    }

    async updateFlashSale(flashSaleId: string, param: updateFlashSaleDto) {
        const flashSaleInfo = await this.getFlashSaleById(flashSaleId);
        for (const key in param) {
            flashSaleInfo[key] = param[key];
        }
        return this.flashSaleRepo.save(flashSaleInfo);
    }
}
