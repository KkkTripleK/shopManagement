import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';

@Entity()
export class orderConfirmDto {
  @ApiProperty()
  id: string;
}
