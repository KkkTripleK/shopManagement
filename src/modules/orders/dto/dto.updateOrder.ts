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
  @ApiProperty()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(orderPayment)
  payment?: orderPayment;
}
