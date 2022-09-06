import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString, Length } from 'class-validator';

export class LoginDTO {
    @ApiProperty()
    @IsAlphanumeric()
    @IsString()
    @Length(4, 12)
    username: string;

    @ApiProperty()
    @IsAlphanumeric()
    @IsString()
    @Length(4, 12)
    password: string;
}
