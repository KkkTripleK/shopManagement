import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    importPrice?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    price?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    salePrice?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    weight?: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    qtyInstock?: number;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    qtyRemaining?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;
}
