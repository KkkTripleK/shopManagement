import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { userGender, userStatus } from 'src/commons/common.enum';
import { Entity } from 'typeorm';

@Entity()
export class UpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsAlpha()
  @IsString()
  @Length(3, 20)
  @IsOptional()
  fullName?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(userGender)
  gender?: userGender;

  @ApiProperty()
  @IsString()
  @IsOptional()
  age?: string;

  @ApiProperty()
  @IsEnum(userStatus)
  @IsOptional()
  accountStatus?: userStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;
}
