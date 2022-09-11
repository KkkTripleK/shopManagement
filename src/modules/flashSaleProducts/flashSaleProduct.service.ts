import { BadRequestException, Injectable } from '@nestjs/common';
import { productStatus } from 'src/commons/common.enum';
import { FlashSaleService } from '../flashSales/flashSale.service';
import { ProductRepository } from '../products/product.repo';
import { createFlashSaleProductDto } from './dto/dto.create';
import { FlashSaleProductRepository } from './flashSaleProduct.repo';

@Injectable()
export class FlashSaleProductService {
    constructor(
        private flashSaleProductRepo: FlashSaleProductRepository,
        private flashSaleService: FlashSaleService,
        private productRepository: ProductRepository,
    ) {}

    async createFlashSaleProduct(flashSaleProductInfo: createFlashSaleProductDto) {
        try {
            // Check exist ProductID, FlashSaleID
            await this.flashSaleService.getFlashSaleById(flashSaleProductInfo.fk_FlashSale.toString());
            const productInfo = await this.productRepository.showProductByProductId({
                id: flashSaleProductInfo.fk_Product,
            });
            if (productInfo === null) {
                throw new BadRequestException('ProductID is invalid!');
            } else if (productInfo.status === productStatus.INACTIVE) {
                throw new BadRequestException('ProductID is inactive!');
            } else if (productInfo.status === productStatus.OUTSTOCK) {
                throw new BadRequestException('ProductID is out stock!');
            }
            // Check exist FlashSaleProduct
            const result = await this.flashSaleProductRepo.checkExistFlashSaleProduct(
                flashSaleProductInfo.fk_FlashSale.toString(),
                flashSaleProductInfo.fk_Product.toString(),
            );
            if (result !== null) {
                throw new BadRequestException('FlashSale-Product is exsit!');
            }

            // Check input data
            if (flashSaleProductInfo.qtyRemain === undefined) {
                flashSaleProductInfo.qtyRemain = flashSaleProductInfo.totalQty;
            } else if (flashSaleProductInfo.qtyRemain >= flashSaleProductInfo.totalQty) {
                throw new BadRequestException('The remaining quantity cannot be greater than the total quantity!');
            } else if (flashSaleProductInfo.qtyRemain <= 0) {
                throw new BadRequestException('The remaining quantity cannot be smaller than 0!');
            }
            if (flashSaleProductInfo.discount >= 100) {
                throw new BadRequestException('The discount cannot be equal or greater than 100%!');
            }
            return this.flashSaleProductRepo.createFlashSaleProduct(flashSaleProductInfo);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('ProductID or FlashSaleID is invalid!');
        }
    }

    async getFlashSaleProductByFlashSaleId(fk_FlashSaleId: string) {
        return this.flashSaleProductRepo.getFlashSaleProductByFlashSaleId(fk_FlashSaleId);
    }

    async updateFlashSaleProduct(fk_FlashSaleProductId: string, param: object) {
        return this.flashSaleProductRepo.updateFlashSaleProduct(fk_FlashSaleProductId, param);
    }
}
