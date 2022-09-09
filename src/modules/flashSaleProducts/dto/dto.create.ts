import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
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
    @IsDateString({}, { each: true })
    begin: Date[];

    @ApiProperty()
    @IsDateString({}, { each: true })
    end: Date[];

    @ApiProperty()
    @IsOptional()
    fk_Product?: ProductEntity;

    @ApiProperty()
    @IsOptional()
    fk_FlashSale?: FlashSaleEntity;
}
