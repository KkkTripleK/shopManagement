import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString, Length } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class VerifyDTO {
  @ApiProperty()
  @IsAlphanumeric()
  @IsString()
  @Length(4, 15)
  username: string;

  @ApiProperty()
  @IsString()
  activeCode: string;
}
