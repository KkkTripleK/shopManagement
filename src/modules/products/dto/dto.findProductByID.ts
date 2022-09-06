import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindProductDto {
  @ApiProperty()
  @IsString()
  productID: string;
}
