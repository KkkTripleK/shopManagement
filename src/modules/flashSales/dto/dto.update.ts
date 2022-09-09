import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';

export class updateFlashSaleDto {
    @ApiProperty()
    @IsDateString({}, { each: true })
    @IsOptional()
    flashSaleBegin?: Date[];

    @ApiProperty()
    @IsDateString({}, { each: true })
    @IsOptional()
    flashSaleEnd?: Date[];

    @ApiProperty()
    @Type(() => Boolean)
    @IsOptional()
    onSale?: boolean;
}
