import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class createCouponDto {
  @ApiProperty()
  @IsString()
  totalQty: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  qtyRemain?: string;

  @ApiProperty()
  @IsString()
  discount: string;

  @ApiProperty()
  @IsDateString({}, { each: true })
  begin: Date[];

  @ApiProperty()
  @IsDateString({}, { each: true })
  end: Date[];
}
