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
        return this.flashSaleProductRepo.save(flashSaleProductInfo);
    }

    async getFlashSaleProductByFlashSaleId(fk_FlashSaleId: string) {
        const rs = this.flashSaleProductRepo
            .createQueryBuilder('flashSaleProduct')
            .leftJoinAndSelect('flashSaleProduct.fk_Product', 'fk_Product')
            .leftJoinAndSelect('flashSaleProduct.fk_FlashSale', 'fk_FlashSale')
            .where('fk_FlashSale.id =:id', { id: fk_FlashSaleId })
            .getMany();
        return rs;
    }

    async getFlashSaleProductByFlashSaleProductId(fk_FlashSaleProductId: string) {
        const rs = this.flashSaleProductRepo
            .createQueryBuilder('flashSaleProduct')
            .leftJoinAndSelect('flashSaleProduct.fk_Product', 'fk_Product')
            .leftJoinAndSelect('flashSaleProduct.fk_FlashSale', 'fk_FlashSale')
            .where('flashSaleProduct.id =:id', { id: fk_FlashSaleProductId })
            .getOne();
        return rs;
    }

    async updateFlashSaleProduct(fk_FlashSaleProductId: string, param: object) {
        const flashSaleProductInfo = await this.getFlashSaleProductByFlashSaleProductId(fk_FlashSaleProductId);
        for (const key in param) {
            flashSaleProductInfo[key] = param[key];
        }
        return this.flashSaleProductRepo.save(flashSaleProductInfo);
    }
}
