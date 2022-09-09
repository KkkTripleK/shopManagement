import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { flashSaleProductStatus } from '../commons/common.enum';
import { FlashSaleProductService } from '../modules/flashSaleProducts/flashSaleProduct.service';
import { FlashSaleService } from '../modules/flashSales/flashSale.service';
import { ProductService } from '../modules/products/product.service';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private flashSaleService: FlashSaleService,
        private productService: ProductService,
        private flashSaleProductService: FlashSaleProductService,
    ) {}

    @Cron(CronExpression.EVERY_SECOND)
    async handleCron() {
        const now = Date.now();
        const listFlashSale = await this.flashSaleService.getListFLashSale();
        for (const flashSale of listFlashSale) {
            if (
                flashSale.flashSaleBegin.getTime() <= now &&
                flashSale.flashSaleEnd.getTime() >= now &&
                flashSale.onSale !== true
            ) {
                await this.flashSaleService.updateFlashSale(flashSale.id, { onSale: true });
                const listFlashSaleProduct = await this.flashSaleProductService.getFlashSaleProductByFlashSaleId(
                    flashSale.id,
                );
                for (const flashSaleProduct of listFlashSaleProduct) {
                    await this.flashSaleProductService.updateFlashSaleProduct(flashSaleProduct.id, {
                        status: flashSaleProductStatus.ONSALE,
                    });
                }
                await this.productService.inFlashSale(flashSale);
                return `FlashSaleID ${flashSale.id} is start!`;
            } else if (
                (flashSale.flashSaleBegin.getTime() >= now || flashSale.flashSaleEnd.getTime() <= now) &&
                flashSale.onSale !== false
            ) {
                await this.flashSaleService.updateFlashSale(flashSale.id, { onSale: false });
                const listFlashSaleProduct = await this.flashSaleProductService.getFlashSaleProductByFlashSaleId(
                    flashSale.id,
                );
                for (const flashSaleProduct of listFlashSaleProduct) {
                    await this.flashSaleProductService.updateFlashSaleProduct(flashSaleProduct.id, {
                        status: flashSaleProductStatus.ACTIVE,
                    });
                }
                await this.productService.flashSaleOver(flashSale);
                return `FlashSaleID ${flashSale.id} is stop!`;
            }
        }
    }
}
