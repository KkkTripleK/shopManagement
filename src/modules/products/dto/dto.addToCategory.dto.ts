import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddProductToCategoryDto {
    @ApiProperty()
    @IsString()
    productId: string;

    @ApiProperty()
    @IsString()
    categoryId: string;
}
