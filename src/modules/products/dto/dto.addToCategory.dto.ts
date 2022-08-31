import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class AddProductToCategoryDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  categoryId: string;
}
