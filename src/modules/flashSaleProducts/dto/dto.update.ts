import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { FlashSaleEntity } from 'src/modules/flashSales/flashSale.entity';
import { ProductEntity } from 'src/modules/products/product.entity';

export class updateFlashSaleProductDto {
    @ApiProperty()
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    totalQty?: number;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    qtyRemain?: number;

    @ApiProperty()
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    discount?: number;

    @ApiProperty()
    @IsOptional()
    fk_Product?: ProductEntity;

    @ApiProperty()
    @IsOptional()
    fk_FlashSale?: FlashSaleEntity;
}
