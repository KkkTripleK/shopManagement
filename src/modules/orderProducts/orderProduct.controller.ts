import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { userRole } from '../../commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JwtAuthGuard } from '../../guards/guard.jwt';
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

    @Get('user/order-product/:orderId')
    @UseGuards(JwtAuthGuard)
    async getListProductByOrderId(@Param('orderId', new ParseUUIDPipe()) orderId: string, @Req() req: any) {
        return this.orderProductService.getListProductByOrderId(orderId, req.userInfo.username);
    }

    @Get('admin/order-product/:orderId')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async adminGetListProductByOrderId(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
        return this.orderProductService.adminGetListProductByOrderId(orderId);
    }

    @Post('user/order-product')
    @UseGuards(JwtAuthGuard)
    async addProductToOrder(@Body() requestBody: createOrderProductDto, @Req() req: any): Promise<OrderProductEntity> {
        return this.orderProductService.createOrderProduct(requestBody, req.userInfo.username);
    }

    @Patch('user/order-product/:orderProductId')
    @UseGuards(JwtAuthGuard)
    async updateProductInOrderProduct(
        @Body() requestBody: updateOrderProductDto,
        @Param('orderProductId') orderProductId: string,
        @Req() req: any,
    ) {
        return this.orderProductService.updateProductInOrderProduct(
            orderProductId,
            requestBody.qty,
            req.userInfo.username,
        );
    }

    @Delete('user/order-product/:orderProductId')
    @UseGuards(JwtAuthGuard)
    async deleteOrderProductInOrder(@Param('orderProductId') orderProductId: string, @Req() req: any) {
        await this.orderProductService.deleteOrderProductInOrder(orderProductId, req.userInfo.username);
        return 'Delete successful!';
    }
}
