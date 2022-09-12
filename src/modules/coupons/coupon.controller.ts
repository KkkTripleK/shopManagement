import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { userRole } from '../../commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { CouponEntity } from './coupon.entity';
import { CouponService } from './coupon.service';
import { createCouponDto } from './dto/dto.createCoupon';
import { updateCouponDto } from './dto/dto.updateCoupon';

@ApiBearerAuth()
@ApiTags('Coupon')
@Controller()
export class CouponController {
    constructor(private couponService: CouponService) {}

    @Post('admin/coupon')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async createNewCoupon(@Body() couponInfo: createCouponDto) {
        return this.couponService.createNewCoupon(couponInfo);
    }

    @Patch('admin/coupon/:couponId')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async updateCouponInfo(@Param('couponId') couponId: string, @Body() param: updateCouponDto) {
        return this.couponService.updateCouponInfo(couponId, param);
    }

    @Get('user/coupon/info/:couponId')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    async getCoupon(@Param('couponId') couponId: string) {
        return this.couponService.getCouponById(couponId);
    }

    @Get('user/coupon/list')
    @ApiQuery({
        name: 'limit',
        type: 'number',
    })
    @ApiQuery({
        name: 'page',
        type: 'number',
    })
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    async getListCoupon(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<CouponEntity>> {
        return this.couponService.getListCoupon({
            page,
            limit,
            route: `localhost:${process.env.PORT}/api/v1/user/coupon/list`,
        });
    }

    @Delete('admin/coupon/:couponId')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async inactiveCoupon(@Param('couponId') couponId: string) {
        return this.couponService.inactiveCoupon(couponId);
    }
}
