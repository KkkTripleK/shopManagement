import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePictureDto {
    @ApiProperty()
    @IsString()
    filename: string;
}
