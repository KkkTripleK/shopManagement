import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class createCouponDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  totalQty: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  qtyRemain?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsDateString({}, { each: true })
  begin: Date[];

  @ApiProperty()
  @IsDateString({}, { each: true })
  end: Date[];
}
