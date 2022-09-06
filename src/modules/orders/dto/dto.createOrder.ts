import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches } from 'class-validator';
import { orderPayment, orderShipment } from 'src/commons/common.enum';
import { UserEntity } from 'src/modules/users/user.entity';
import { PHONE_REGEX } from 'src/utils/util.regex';

export class createOrderDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fk_User: UserEntity;

    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @Matches(PHONE_REGEX)
    phone: string;

    @ApiProperty()
    @IsEnum(orderPayment)
    payment: orderPayment;

    @ApiProperty()
    @IsEnum(orderShipment)
    shipment: orderShipment;
}
