import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { couponStatus } from '../../commons/common.enum';
import { CouponEntity } from './coupon.entity';
import { CouponRepository } from './coupon.repo';
import { createCouponDto } from './dto/dto.createCoupon';
import { updateCouponDto } from './dto/dto.updateCoupon';

@Injectable()
export class CouponService {
    constructor(private couponRepo: CouponRepository) {}
    async createNewCoupon(couponInfo: createCouponDto) {
        couponInfo.qtyRemain = couponInfo.totalQty;
        return this.couponRepo.createNewCoupon(couponInfo);
    }

    async updateCouponInfo(couponId: string, param: updateCouponDto) {
        const couponInfo = await this.getCouponById(couponId);
        for (const key in param) {
            couponInfo[key] = param[key];
        }
        return this.couponRepo.updateCouponInfo(couponInfo);
    }

    async getCouponById(couponId: string): Promise<CouponEntity> {
        const couponInfo = await this.couponRepo.getCouponById(couponId);
        if (couponInfo === null) {
            throw new NotFoundException('CouponId is invalid');
        }
        return couponInfo;
    }

    async getListCoupon(options?: IPaginationOptions): Promise<Pagination<CouponEntity>> {
        return this.couponRepo.getListCoupon(options);
    }

    async inactiveCoupon(couponId: string) {
        return this.updateCouponInfo(couponId, { status: couponStatus.INACTIVE });
    }
}
