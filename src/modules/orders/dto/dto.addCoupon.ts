import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class addCouponDto {
  @ApiProperty()
  @IsString()
  couponId: string;

  @ApiProperty()
  @IsString()
  orderId: string;
}
