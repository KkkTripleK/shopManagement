import { Injectable } from '@nestjs/common';
import { couponStatus } from 'src/commons/common.enum';
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
        return this.couponRepo.getCouponById(couponId);
    }

    async getListCoupon(): Promise<CouponEntity[]> {
        return this.couponRepo.getListCoupon();
    }

    async inactiveCoupon(couponId: string) {
        return this.updateCouponInfo(couponId, { status: couponStatus.INACTIVE });
    }
}
