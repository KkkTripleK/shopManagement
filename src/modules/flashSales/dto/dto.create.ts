import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class createFlashSaleDto {
    @ApiProperty()
    @IsDateString({}, { each: true })
    flashSaleBegin: Date[];

    @ApiProperty()
    @IsDateString({}, { each: true })
    flashSaleEnd: Date[];
}
