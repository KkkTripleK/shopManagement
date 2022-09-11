import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class createFlashSaleDto {
    @ApiProperty()
    @IsDateString({}, { each: true })
    flashSaleBegin: Date[];

    @ApiProperty()
    @IsDateString({}, { each: true })
    flashSaleEnd: Date[];

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    notification?: boolean;

    @ApiProperty()
    @Type(() => Boolean)
    onSale: boolean;
}
