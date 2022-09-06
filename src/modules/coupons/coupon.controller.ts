import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { userRole } from 'src/commons/common.enum';
import { Roles } from 'src/decorators/decorator.roles';
import { JWTandRolesGuard } from 'src/guards/guard.roles';
import { CouponService } from './coupon.service';
import { createCouponDto } from './dto/dto.createCoupon';
import { updateCouponDto } from './dto/dto.updateCoupon';

@ApiBearerAuth()
@ApiTags('Coupons')
@Controller()
export class CouponController {
    constructor(private couponService: CouponService) {}

    @Post('admin/coupon')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async createNewCoupon(@Body() couponInfo: createCouponDto) {
        console.log(couponInfo);
        return this.couponService.createNewCoupon(couponInfo);
    }

    @Patch('admin/coupon/:couponId')
    async updateCouponInfo(@Param('couponId') couponId: string, @Body() param: updateCouponDto) {
        return this.couponService.updateCouponInfo(couponId, param);
    }

    @Get('user/coupon/:couponId')
    async getCoupon(@Param('couponId') couponId: string) {
        return this.couponService.getCouponById(couponId);
    }

    @Get('user/coupon/all')
    async getListCoupon() {
        return this.couponService.getListCoupon();
    }

    @Delete('admin/coupon/:couponId')
    async inactiveCoupon(@Param('couponId') couponId: string) {
        return this.couponService.inactiveCoupon(couponId);
    }
}
