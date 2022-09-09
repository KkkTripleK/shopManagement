import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString } from 'class-validator';

export class createFlashSaleDto {
    @ApiProperty()
    @IsDateString({}, { each: true })
    flashSaleBegin: Date[];

    @ApiProperty()
    @IsDateString({}, { each: true })
    flashSaleEnd: Date[];

    @ApiProperty()
    @Type(() => Boolean)
    onSale: boolean;
}