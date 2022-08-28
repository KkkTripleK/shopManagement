import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  // eslint-disable-next-line prettier/prettier
  Length
} from 'class-validator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreateUserDto {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

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

  @ApiProperty()
  @IsEmail()
  @Length(5, 50)
  email: string;

  @ApiProperty()
  @IsAlpha()
  @IsString()
  @Length(3, 20)
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  age: string;

  @IsString()
  @IsOptional()
  accountStatus: string;

  @IsString()
  @IsOptional()
  isAdmin: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;
}
