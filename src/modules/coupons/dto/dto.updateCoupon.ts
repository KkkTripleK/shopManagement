import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { couponStatus } from 'src/commons/common.enum';

export class updateCouponDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    totalQty?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    qtyRemain?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    discount?: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(couponStatus)
    status?: string;

    @IsOptional()
    @ApiProperty()
    @IsDateString({}, { each: true })
    begin?: Date[];

    @ApiProperty()
    @IsOptional()
    @IsDateString({}, { each: true })
    end?: Date[];
}
