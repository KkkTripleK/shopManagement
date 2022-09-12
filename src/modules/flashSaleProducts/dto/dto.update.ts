import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { flashSaleProductStatus } from 'src/commons/common.enum';

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
    @IsEnum(flashSaleProductStatus)
    status?: flashSaleProductStatus;
}
