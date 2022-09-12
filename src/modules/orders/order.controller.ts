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
    Req,
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
import { userRole } from '../../commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { addCouponDto } from './dto/dto.addCoupon';
import { createOrderDto } from './dto/dto.createOrder';
import { updateOrderDto } from './dto/dto.updateOrder';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';

@ApiBearerAuth()
@ApiTags('Order')
@Controller()
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get('user/order')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.MEMBER, userRole.ADMIN)
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiBadRequestResponse()
    async getListOrderByUsername(
        @Req() req: any,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<OrderEntity>> {
        const fk_User = req.userInfo.username;
        return this.orderService.showListOrderByUsername(
            {
                page,
                limit,
                route: `localhost:${process.env.PORT}/user/order`,
            },
            fk_User,
        );
    }

    @Get('user/order/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.MEMBER, userRole.ADMIN)
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiBadRequestResponse()
    async getOrderByIdAndUsername(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
        const fk_User = req.userInfo.username;
        return this.orderService.getOrderByOrderIdAndUsername(id, fk_User);
    }

    @Post('user/order/create')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.MEMBER, userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiCreatedResponse()
    async createOrder(@Body() orderInfo: createOrderDto, @Req() req: any) {
        orderInfo.fk_User = req.userInfo.username;
        return this.orderService.createOrder(orderInfo);
    }

    @Patch('user/order/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.MEMBER, userRole.ADMIN)
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async updateOrder(@Param('id') id: string, @Body() updateOrder: updateOrderDto, @Req() req: any) {
        const fk_User = req.userInfo.username;
        return this.orderService.updateOrder(id, updateOrder, fk_User);
    }

    @Delete('user/order/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.MEMBER, userRole.ADMIN)
    @ApiOkResponse()
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async deleteOrder(@Param('id') id: string, @Req() req: any) {
        const fk_User = req.userInfo.username;
        return this.orderService.deleteOrder(id, fk_User);
    }

    @Get('admin/order')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async adminGetListOrder(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<OrderEntity>> {
        return this.orderService.adminGetListOrder({
            page,
            limit,
            route: `localhost:${process.env.PORT}/admin/order`,
        });
    }

    @Get('admin/order/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async adminGetOrderByID(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.orderService.adminGetOrderByOrderID(id);
    }

    @Get('admin/order/username/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async adminGetOrderByUsername(
        @Param('id') id: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<OrderEntity>> {
        return this.orderService.adminGetOrderByUsername(
            {
                page,
                limit,
                route: `localhost:${process.env.PORT}/admin/order/username/${id}`,
            },
            id,
        );
    }

    @Post('user/order/confirm')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.MEMBER, userRole.ADMIN)
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async orderConfirm(@Body('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
        const fk_User = req.userInfo.username;
        return this.orderService.orderConfirm(id, fk_User);
    }

    @Post('user/order/add-coupon')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.MEMBER, userRole.ADMIN)
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiBadRequestResponse()
    async addCouponToOrder(@Body() requestBody: addCouponDto, @Req() req: any) {
        return this.orderService.addCouponToOrder(requestBody, req.userInfo.username);
    }

    @Delete('user/order/remove-coupon')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.MEMBER, userRole.ADMIN)
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiBadRequestResponse()
    async removeCouponFromOrder(@Body() requestBody: addCouponDto, @Req() req: any) {
        return this.orderService.removeCouponFromOrder(requestBody, req.userInfo.username);
    }
}
