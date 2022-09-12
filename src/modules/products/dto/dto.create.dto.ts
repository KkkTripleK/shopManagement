import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { productStatus } from '../../../commons/common.enum';

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
    @Type(() => Number)
    @IsNumber()
    qtyInstock: number;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    qtyRemaining?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @ApiProperty()
    @IsEnum(productStatus)
    status?: productStatus;
}
