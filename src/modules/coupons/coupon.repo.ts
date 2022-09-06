import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async getCoupon(couponId: string) {
    return this.couponRepo.findOne({ where: [{ id: couponId }] });
  }

  async getListCoupon() {
    return this.couponRepo.find();
  }
}
