import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createFlashSaleDto } from './dto/dto.create';
import { FlashSaleEntity } from './flashSale.entity';

@Injectable()
export class FlashSaleRepository {
    constructor(
        @InjectRepository(FlashSaleEntity)
        private flashSalerRepo: Repository<FlashSaleEntity>,
    ) {}

    async createFlashSale(flashSaleInfo: createFlashSaleDto) {
        return this.flashSalerRepo.save(flashSaleInfo);
    }
}
