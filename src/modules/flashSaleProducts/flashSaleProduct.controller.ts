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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { flashSaleProductStatus, userRole } from '../../commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { createFlashSaleProductDto } from './dto/dto.create';
import { updateFlashSaleProductDto } from './dto/dto.update';
import { FlashSaleProductEntity } from './flashSaleProduct.entity';
import { FlashSaleProductService } from './flashSaleProduct.service';

@ApiBearerAuth()
@ApiTags('FlashSaleProduct')
@Controller()
export class FlashSaleProductController {
    constructor(private flashSaleProductService: FlashSaleProductService) {}

    @Post('admin/flashsale-product')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiCreatedResponse()
    async createFlashSaleProduct(@Body() flashSaleProductInfo: createFlashSaleProductDto) {
        return this.flashSaleProductService.createFlashSaleProduct(flashSaleProductInfo);
    }

    @Patch('admin/flashsale-product/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async updateFlashSaleProduct(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() requestBody: updateFlashSaleProductDto,
    ) {
        return this.flashSaleProductService.updateFlashSaleProduct(id, requestBody);
    }

    @Get('flashsale-product')
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
            route: `localhost:${process.env.PORT}/api/v1/flashsale-product`,
        });
    }

    @ApiOkResponse()
    @ApiBadRequestResponse()
    @Get('flashsale-product/:id')
    async getFlashSaleProductByFlashSaleProductId(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.flashSaleProductService.getFlashSaleProductByFlashSaleProductId(id);
    }

    @Delete('admin/flashsale-product/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async deleteFlashSaleProduct(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.flashSaleProductService.updateFlashSaleProduct(id, {
            status: flashSaleProductStatus.INACTIVE,
        });
    }
}
