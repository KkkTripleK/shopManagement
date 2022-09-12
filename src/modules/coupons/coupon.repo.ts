import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { couponStatus } from 'src/commons/common.enum';
import { Repository } from 'typeorm';
import { CouponEntity } from './coupon.entity';
import { createCouponDto } from './dto/dto.createCoupon';

@Injectable()
export class CouponRepository {
    constructor(
        @InjectRepository(CouponEntity)
        private couponRepo: Repository<CouponEntity>,
    ) {}
    async createNewCoupon(couponInfo: createCouponDto): Promise<CouponEntity> {
        return this.couponRepo.save(couponInfo);
    }

    async updateCouponInfo(couponInfo: CouponEntity) {
        return this.couponRepo.save(couponInfo);
    }

    async getCouponById(couponId: string) {
        return this.couponRepo.findOne({ where: [{ id: couponId }] });
    }

    async getListCoupon(options: IPaginationOptions): Promise<Pagination<CouponEntity>> {
        const listCoupon = await this.couponRepo.manager
            .createQueryBuilder(CouponEntity, 'coupon')
            .where({ status: couponStatus.ACTIVE })
            .orderBy('coupon.begin');
        return paginate<CouponEntity>(listCoupon, options);
    }
}
