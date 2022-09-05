import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { ProductEntity } from 'src/modules/products/product.entity';
import { Entity } from 'typeorm';

@Entity()
export class createOrderProductDto {
  @ApiProperty()
  @IsOptional()
  fk_Order?: OrderEntity;

  @ApiProperty()
  @IsOptional()
  fk_Product?: ProductEntity;

  @ApiProperty()
  @IsString()
  qty: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalPrice?: number;
}
