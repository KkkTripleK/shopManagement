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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
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
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiOkResponse()
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async createNewCoupon(@Body() couponInfo: createCouponDto) {
        return this.couponService.createNewCoupon(couponInfo);
    }

    @Patch('admin/coupon/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiOkResponse()
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async updateCouponInfo(@Param('id') id: string, @Body() param: updateCouponDto) {
        return this.couponService.updateCouponInfo(id, param);
    }

    @Get('user/coupon/:id')
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiOkResponse()
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    async getCoupon(@Param('id') id: string) {
        return this.couponService.getCouponById(id);
    }

    @Get('user/coupon')
    @ApiQuery({
        name: 'limit',
        type: 'number',
    })
    @ApiQuery({
        name: 'page',
        type: 'number',
    })
    @UseGuards(JWTandRolesGuard)
    @ApiOkResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    @Roles(userRole.ADMIN, userRole.MEMBER)
    async getListCoupon(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<CouponEntity>> {
        return this.couponService.getListCoupon({
            page,
            limit,
            route: `localhost:${process.env.PORT}/api/v1/user/coupon`,
        });
    }

    @Delete('admin/coupon/:id')
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiOkResponse()
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async inactiveCoupon(@Param('id') id: string) {
        return this.couponService.inactiveCoupon(id);
    }
}
