import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  id?: string;

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
  cost?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  netPrice?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  salePrice?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  qtyInstock?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  qtyRemaining?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
