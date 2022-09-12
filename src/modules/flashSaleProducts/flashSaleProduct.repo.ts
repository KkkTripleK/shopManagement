import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { productStatus } from '../../commons/common.enum';
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
        const flashSaleProductInfo = this.flashSaleProductRepo
            .createQueryBuilder('flashSaleProduct')
            .leftJoinAndSelect('flashSaleProduct.fk_Product', 'fk_Product')
            .leftJoinAndSelect('flashSaleProduct.fk_FlashSale', 'fk_FlashSale')
            .where('fk_FlashSale.id =:id', { id: fk_FlashSaleId })
            .andWhere('fk_Product.status =:status', { status: productStatus.STOCK })
            .getMany();
        return flashSaleProductInfo;
    }

    async checkExistFlashSaleProduct(fk_FlashSaleId: string, fk_ProductId: string) {
        const flashSaleProductInfo = this.flashSaleProductRepo
            .createQueryBuilder('flashSaleProduct')
            .leftJoinAndSelect('flashSaleProduct.fk_Product', 'fk_Product')
            .leftJoinAndSelect('flashSaleProduct.fk_FlashSale', 'fk_FlashSale')
            .where('fk_FlashSale.id =:id', { id: fk_FlashSaleId })
            .where('fk_Product.id =:id', { id: fk_ProductId })
            .andWhere('fk_Product.status =:status', { status: productStatus.STOCK })
            .getOne();
        return flashSaleProductInfo;
    }

    async getFlashSaleProductByFlashSaleProductId(fk_FlashSaleProductId: string) {
        const rs = this.flashSaleProductRepo
            .createQueryBuilder('flashSaleProduct')
            .leftJoinAndSelect('flashSaleProduct.fk_Product', 'fk_Product')
            .leftJoinAndSelect('flashSaleProduct.fk_FlashSale', 'fk_FlashSale')
            .where('flashSaleProduct.id =:id', { id: fk_FlashSaleProductId })
            .andWhere('fk_Product.status =:status', { status: productStatus.STOCK })
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

    async listFlashSaleProduct(options: IPaginationOptions): Promise<Pagination<FlashSaleProductEntity>> {
        const listFlashSaleProduct = await this.flashSaleProductRepo
            .createQueryBuilder('flashSaleProduct')
            .leftJoinAndSelect('flashSaleProduct.fk_Product', 'fk_Product')
            .leftJoinAndSelect('flashSaleProduct.fk_FlashSale', 'fk_FlashSale')
            .andWhere('fk_Product.status =:status', { status: productStatus.STOCK })
            .orderBy('fk_FlashSale.flashSaleBegin');
        return paginate<FlashSaleProductEntity>(listFlashSaleProduct, options);
    }
}
