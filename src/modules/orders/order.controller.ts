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
import { Roles } from '../../decorators/decorator.roles';
import { JwtAuthGuard } from '../../guards/guard.jwt';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { createOrderDto } from './dto/dto.createOrder';
import { orderConfirmDto } from './dto/dto.orderConfirm';
import { updateOrderDto } from './dto/dto.updateOrder';
import { OrderService } from './order.service';

@ApiBearerAuth()
@ApiTags('Order')
@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('user/order/all')
  @UseGuards(JwtAuthGuard)
  async getListOrder(@Req() req: any) {
    const fk_User = req.userInfo.username;
    return this.orderService.getListOrder(fk_User);
  }

  @Get('user/order/:orderId')
  @UseGuards(JwtAuthGuard)
  async getOrderByIdAndUsername(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Req() req: any,
  ) {
    const fk_User = req.userInfo.username;
    return this.orderService.getOrderByIdAndUsername(orderId, fk_User);
  }

  @Post('user/order/create')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() orderInfo: createOrderDto, @Req() req: any) {
    orderInfo.fk_User = req.userInfo.username;
    return this.orderService.createOrder(orderInfo);
  }

  @Patch('user/order/:orderId')
  @UseGuards(JwtAuthGuard)
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateOrder: updateOrderDto,
    @Req() req: any,
  ) {
    const fk_User = req.userInfo.username;
    return this.orderService.updateOrder(orderId, updateOrder, fk_User);
  }

  @Delete('user/order/:orderId')
  @UseGuards(JwtAuthGuard)
  async deleteOrder(@Param('orderId') orderId: string, @Req() req: any) {
    const fk_User = req.userInfo.username;
    return this.orderService.deleteOrder(orderId, fk_User);
  }

  @Get('admin/order/all')
  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  async adminGetListOrder() {
    return this.orderService.adminGetListOrder();
  }

  @Get('admin/order/id/:orderId')
  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  async adminGetOrderByID(@Param('orderId') orderId: string) {
    return this.orderService.adminGetOrderByID(orderId);
  }

  @Get('admin/order/username/:username')
  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  async adminGetOrderByUsername(@Param('username') username: string) {
    return this.orderService.adminGetOrderByUsername(username);
  }

  @Post('user/order/confirm')
  @UseGuards(JwtAuthGuard)
  async orderConfirm(@Body() requestBody: orderConfirmDto, @Req() req: any) {
    const fk_User = req.userInfo.username;
    return this.orderService.orderConfirm(requestBody.id, fk_User);
  }
}
