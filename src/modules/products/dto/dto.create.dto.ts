import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { productStatus } from 'src/commons/common.enum';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
  @IsString()
  cost: string;

  @ApiProperty()
  @IsString()
  netPrice: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  salePrice?: string;

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
