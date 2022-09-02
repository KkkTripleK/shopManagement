import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';

@Entity()
export class uploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: 'jpeg';
}
