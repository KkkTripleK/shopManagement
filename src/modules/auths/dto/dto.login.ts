import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString, Length } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
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
