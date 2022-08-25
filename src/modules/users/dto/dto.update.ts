import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsOptional, IsString, Length } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class UpdateDTO {
  @ApiProperty()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsAlpha()
  @IsString()
  @Length(3, 20)
  @IsOptional()
  fullName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  age?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  accountStatus?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;
}
