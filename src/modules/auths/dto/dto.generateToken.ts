import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateTokenDto {
    @ApiProperty()
    @IsString()
    refreshToken: string;
}
