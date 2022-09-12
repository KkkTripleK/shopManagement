import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { userRole } from '../../commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { createOrderProductDto } from './dto/dto.createOrderProduct';
import { updateOrderProductDto } from './dto/dto.updateOrderProduct';
import { OrderProductEntity } from './orderProduct.entity';
import { OrderProductService } from './orderProduct.service';

@ApiBearerAuth()
@ApiTags('OrderProduct')
@Controller()
export class OrderProductController {
    constructor(private orderProductService: OrderProductService) {}

    @Get('user/order-product/order/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async getListProductByOrderId(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
        return this.orderProductService.getListProductByOrderId(id, req.userInfo.username);
    }

    @Get('admin/order-product/order/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async adminGetListProductByOrderId(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.orderProductService.adminGetListProductByOrderId(id);
    }

    @Post('user/order-product')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async addProductToOrder(@Body() requestBody: createOrderProductDto, @Req() req: any): Promise<OrderProductEntity> {
        return this.orderProductService.createOrderProduct(requestBody, req.userInfo.username);
    }

    @Patch('user/order-product/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async updateProductInOrderProduct(
        @Body() requestBody: updateOrderProductDto,
        @Param('id') id: string,
        @Req() req: any,
    ) {
        return this.orderProductService.updateProductInOrderProduct(id, requestBody.qty, req.userInfo.username);
    }

    @Delete('user/order-product/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async deleteOrderProductInOrder(@Param('id') id: string, @Req() req: any) {
        await this.orderProductService.deleteOrderProductInOrder(id, req.userInfo.username);
        return 'Delete successful!';
    }
}
