import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { orderPayment, orderShipment } from 'src/commons/common.enum';
import { UserEntity } from 'src/modules/users/user.entity';
import { Entity } from 'typeorm';

@Entity()
export class createOrderDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  fkUsername?: UserEntity;

  @ApiProperty()
  @IsString()
  address: string;

  //su dung Regex
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsEnum(orderPayment)
  payment: orderPayment;

  @ApiProperty()
  @IsEnum(orderShipment)
  shipment: orderShipment;
}
