import { Injectable } from '@nestjs/common';
import { CouponUserRepository } from './couponUser.repo';

@Injectable()
export class CouponUserService {
  constructor(private couponUserRepo: CouponUserRepository) {}
}
