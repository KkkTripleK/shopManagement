import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderEntity } from '../../../modules/orders/order.entity';
import { ProductEntity } from '../../../modules/products/product.entity';

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
