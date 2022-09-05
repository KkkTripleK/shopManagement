import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { userGender, userStatus } from 'src/commons/common.enum';
import { Entity } from 'typeorm';

@Entity()
export class UpdateDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @IsAlpha()
  @IsString()
  @Length(3, 20)
  @IsOptional()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(userGender)
  gender?: userGender;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  age?: string;

  @ApiProperty({ required: false })
  @IsEnum(userStatus)
  @IsOptional()
  accountStatus?: userStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;
}
