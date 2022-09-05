import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { orderPayment } from 'src/commons/common.enum';
import { Entity } from 'typeorm';

@Entity()
export class updateOrderDto {
  @ApiProperty()
  @IsOptional()
  address?: string;

  //su dung Regex
  @ApiProperty({ required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(orderPayment)
  payment?: orderPayment;
}
