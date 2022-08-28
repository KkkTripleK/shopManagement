import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class DeleteAccount {
  @ApiProperty()
  @IsString()
  password: string;
}
