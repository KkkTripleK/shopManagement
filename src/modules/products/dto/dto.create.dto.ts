import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreateProductDto {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  productID: string;

  @ApiProperty()
  @IsString()
  @Length(6, 12)
  categoryID: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  barcode: string;

  @ApiProperty()
  @IsString()
  cost: string;

  @ApiProperty()
  @IsString()
  netPrice: string;

  @ApiProperty()
  @IsString()
  salePrice: string;

  @ApiProperty()
  @IsString()
  weight: string;

  @ApiProperty()
  @IsString()
  qtyInstock: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  status: string;
}
