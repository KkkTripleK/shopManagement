import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { couponStatus } from '../../../commons/common.enum';

export class updateCouponDto {
    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    totalQty?: number;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    qtyRemain?: number;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    discount?: number;

    @ApiProperty()
    @IsOptional()
    @IsEnum(couponStatus)
    status?: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString({}, { each: true })
    begin?: Date[];

    @ApiProperty()
    @IsOptional()
    @IsDateString({}, { each: true })
    end?: Date[];
}
