import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { FlashSaleEntity } from '../../../modules/flashSales/flashSale.entity';
import { ProductEntity } from '../../../modules/products/product.entity';

export class createFlashSaleProductDto {
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
    @IsNotEmpty()
    fk_Product: ProductEntity;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    fk_FlashSale: FlashSaleEntity;
}
