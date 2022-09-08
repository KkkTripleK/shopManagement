import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createFlashSaleProductDto } from './dto/dto.create';
import { FlashSaleProductService } from './flashSaleProduct.service';

@ApiBearerAuth()
@ApiTags('FlashSaleProduct')
@Controller()
export class FlashSaleProductController {
    constructor(private flashSaleProductService: FlashSaleProductService) {}

    @Post('admin/flashSale-Product')
    async createFlashSaleProduct(@Body() flashSaleProductInfo: createFlashSaleProductDto) {
        return this.flashSaleProductService.createFlashSaleProduct(flashSaleProductInfo);
    }
}
