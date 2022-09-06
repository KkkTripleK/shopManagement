import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { orderPayment } from 'src/commons/common.enum';
import { PHONE_REGEX } from 'src/utils/util.regex';

export class updateOrderDto {
  @ApiProperty()
  @IsOptional()
  address?: string;

  //su dung Regex
  @ApiProperty({ required: false })
  @Matches(PHONE_REGEX)
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(orderPayment)
  payment?: orderPayment;
}
