import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { flashSaleProductStatus } from '../commons/common.enum';
import { MailService } from '../modules/email/email.service';
import { FlashSaleProductService } from '../modules/flashSaleProducts/flashSaleProduct.service';
import { FlashSaleService } from '../modules/flashSales/flashSale.service';
import { ProductService } from '../modules/products/product.service';
import { UserService } from '../modules/users/user.service';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private flashSaleService: FlashSaleService,
        private productService: ProductService,
        private flashSaleProductService: FlashSaleProductService,
        private mailService: MailService,
        private userService: UserService,
    ) {}

    @Cron(CronExpression.EVERY_SECOND)
    async handleCron() {
        const now = Date.now();
        const listFlashSale = await this.flashSaleService.getListFLashSale();
        for (const flashSale of listFlashSale) {
            const eventBegin = flashSale.flashSaleBegin.getTime();
            const eventEnd = flashSale.flashSaleEnd.getTime();
            //900000 = 15m
            //30000 = 30s
            // && eventBegin - 25000 <= now
            if (eventBegin - 30000 <= now && eventEnd >= now) {
                const listPlashSaleProduct = await this.flashSaleProductService.getFlashSaleProductByFlashSaleId(
                    flashSale.id,
                );
                const content = [];
                for (let i = 0; i < listPlashSaleProduct.length; i++) {
                    content[i] = listPlashSaleProduct[i].fk_Product.name;
                }

                if (flashSale.notification === false) {
                    const listUser = await this.userService.findListAccount();
                    for (const userInfo of listUser) {
                        setTimeout(() => {
                            this.mailService.sendMail(
                                userInfo.email,
                                'VMO-EShop: Flash Sale is comming!',
                                `<p>Xin chao <b>${userInfo.fullName}</b>,<p>
                                <p>Chi 15phut nua, cac san pham cua VMO-EShop chuan bi duoc giam gia sap san!</p>
                                <p>Cac san pham gom co: <b>${content.toString()}.</b></p>
                                <p>Xin moi ban va gia dinh ghe VMO-EShop de mua sam!</p>
                                <i>Xin cam on!</i>`,
                            );
                        }, 1000);
                        await this.flashSaleService.updateFlashSale(flashSale.id, {
                            notification: true,
                        });
                    }
                }
            }
            // On time
            if (eventBegin <= now && eventEnd >= now && flashSale.onSale !== true) {
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
            } else if ((eventBegin >= now || eventEnd <= now) && flashSale.onSale !== false) {
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
