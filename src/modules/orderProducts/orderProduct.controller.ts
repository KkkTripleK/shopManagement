import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { userRole } from 'src/commons/common.enum';
import { Roles } from 'src/decorators/decorator.roles';
import { JwtAuthGuard } from 'src/guards/guard.jwt';
import { JWTandRolesGuard } from 'src/guards/guard.roles';
import { createOrderProductDto } from './dto/dto.createOrderProduct';
import { updateOrderProductDto } from './dto/dto.updateOrderProduct';
import { OrderProductEntity } from './orderProduct.entity';
import { OrderProductService } from './orderProduct.service';

@ApiBearerAuth()
@ApiTags('OrderProduct')
@Controller()
export class OrderProductController {
  constructor(private orderProductService: OrderProductService) {}

  // Show list products by OrderID
  @Get('user/order-product/:orderId')
  @UseGuards(JwtAuthGuard)
  async getListProductByOrderId(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Req() req: any,
  ) {
    return this.orderProductService.getListProductByOrderId(
      orderId,
      req.userInfo.username,
    );
  }

  //Admin show list products by OrderId
  @Get('admin/order-product/:orderId')
  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  async adminGetListProductByOrderId(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ) {
    return this.orderProductService.adminGetListProductByOrderId(orderId);
  }

  //Create new Order-products
  @Post('user/order-product')
  @UseGuards(JwtAuthGuard)
  async addProductToOrder(
    @Body() requestBody: createOrderProductDto,
    @Req() req: any,
  ): Promise<OrderProductEntity> {
    return this.orderProductService.addProductToOrder(
      requestBody,
      req.userInfo.username,
    );
  }

  @Patch('user/order-product/:orderProductId')
  @UseGuards(JwtAuthGuard)
  async updateProductInOrder(
    @Body() requestBody: updateOrderProductDto,
    @Param('orderProductId') orderProductId: string,
    @Req() req: any,
  ) {
    return this.orderProductService.updateProductInOrder(
      orderProductId,
      requestBody.qty,
      req.userInfo.username,
    );
  }

  @Delete('user/order-product/:orderProductId')
  @UseGuards(JwtAuthGuard)
  async deleteProductInOrder(
    @Param('orderProductId') orderProductId: string,
    @Req() req: any,
  ) {
    return this.orderProductService.deleteProductInOrder(
      orderProductId,
      req.userInfo.username,
    );
  }
}
