import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

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
    @IsOptional()
    @IsBoolean()
    notification?: boolean;

    @ApiProperty()
    @Type(() => Boolean)
    @IsOptional()
    onSale?: boolean;
}
