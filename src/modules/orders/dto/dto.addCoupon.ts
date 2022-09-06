import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { UUID_REGEX } from 'src/utils/util.regex';

export class addCouponDto {
  @ApiProperty()
  @Matches(UUID_REGEX)
  couponId: string;

  @ApiProperty()
  @Matches(UUID_REGEX)
  orderId: string;
}
