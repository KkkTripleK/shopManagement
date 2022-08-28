import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class FindProductDto {
  @ApiProperty()
  @IsString()
  productID: string;
}
