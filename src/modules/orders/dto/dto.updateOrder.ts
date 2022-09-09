import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { orderPayment } from '../../../commons/common.enum';
import { PHONE_REGEX } from '../../../utils/util.regex';

export class updateOrderDto {
    @ApiProperty()
    @IsOptional()
    address?: string;

    @ApiProperty({ required: false })
    @Matches(PHONE_REGEX)
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(orderPayment)
    payment?: orderPayment;
}
