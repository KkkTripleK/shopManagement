import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createFlashSaleDto } from './dto/dto.create';
import { FlashSaleService } from './flashSale.service';

@ApiBearerAuth()
@ApiTags('FlashSale')
@Controller()
export class FlashSaleController {
    constructor(private flashSaleService: FlashSaleService) {}

    @Post('admin/flashSale')
    async createFlashSale(@Body() flashSaleInfo: createFlashSaleDto) {
        return this.flashSaleService.createFlashSale(flashSaleInfo);
    }
}
