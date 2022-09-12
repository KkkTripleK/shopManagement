import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { flashSaleProductStatus, userRole } from 'src/commons/common.enum';
import { Roles } from 'src/decorators/decorator.roles';
import { JWTandRolesGuard } from 'src/guards/guard.roles';
import { createFlashSaleProductDto } from './dto/dto.create';
import { updateFlashSaleProductDto } from './dto/dto.update';
import { FlashSaleProductEntity } from './flashSaleProduct.entity';
import { FlashSaleProductService } from './flashSaleProduct.service';

@ApiBearerAuth()
@ApiTags('FlashSaleProduct')
@Controller()
export class FlashSaleProductController {
    constructor(private flashSaleProductService: FlashSaleProductService) {}

    @Post('admin/flashSale-Product')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async createFlashSaleProduct(@Body() flashSaleProductInfo: createFlashSaleProductDto) {
        return this.flashSaleProductService.createFlashSaleProduct(flashSaleProductInfo);
    }

    @Patch('admin/flashSale-Product/:flashSaleProductId')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async updateFlashSaleProduct(
        @Param('flashSaleProductId', new ParseUUIDPipe()) flashSaleProductId: string,
        @Body() requestBody: updateFlashSaleProductDto,
    ) {
        return this.flashSaleProductService.updateFlashSaleProduct(flashSaleProductId, requestBody);
    }

    @Get('flashSale-Product/all')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async listFlashSaleProduct(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<FlashSaleProductEntity>> {
        return this.flashSaleProductService.listFlashSaleProduct({
            page,
            limit,
            route: `localhost:${process.env.PORT}/api/v1/flashSale-Product/all/`,
        });
    }

    @ApiOkResponse()
    @ApiBadRequestResponse()
    @Get('flashSale-Product/info/:flashSaleProductId')
    async getFlashSaleProductByFlashSaleProductId(
        @Param('flashSaleProductId', new ParseUUIDPipe()) flashSaleProductId: string,
    ) {
        return this.flashSaleProductService.getFlashSaleProductByFlashSaleProductId(flashSaleProductId);
    }

    @Delete('admin/flashSale-Product/:flashSaleProductId')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async deleteFlashSaleProduct(@Param('flashSaleProductId', new ParseUUIDPipe()) flashSaleProductId: string) {
        return this.flashSaleProductService.updateFlashSaleProduct(flashSaleProductId, {
            status: flashSaleProductStatus.INACTIVE,
        });
    }
}
