import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { UUID_REGEX } from 'src/utils/util.regex';

export class orderIDDto {
    @ApiProperty()
    @Matches(UUID_REGEX)
    id: string;
}
