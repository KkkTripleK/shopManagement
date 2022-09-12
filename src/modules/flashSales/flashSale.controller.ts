import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { userRole } from '../../commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { createFlashSaleDto } from './dto/dto.create';
import { FlashSaleService } from './flashSale.service';

@ApiBearerAuth()
@ApiTags('FlashSale')
@Controller()
export class FlashSaleController {
    constructor(private flashSaleService: FlashSaleService) {}

    @Post('admin/flashSale')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async createFlashSale(@Body() flashSaleInfo: createFlashSaleDto) {
        return this.flashSaleService.createFlashSale(flashSaleInfo);
    }
}
