import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryID?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cost?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  netPrice?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  salePrice?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  qtyInstock?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  qtyRemaining?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;
}
