import { Controller } from '@nestjs/common';
import { CouponUserService } from './couponUser.service';

@Controller()
export class CouponUserController {
  constructor(private couponUserService: CouponUserService) {}
}
