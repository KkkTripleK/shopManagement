import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { productStatus } from 'src/commons/common.enum';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateProductDto {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    categoryID?: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    importPrice: number;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsString()
    weight: string;

    @ApiProperty()
    @IsString()
    qtyInstock: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    qtyRemaining?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsEnum(productStatus)
    status: productStatus;
}
