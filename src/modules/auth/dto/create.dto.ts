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
  @PrimaryGeneratedColumn()
  id: string;

  @IsAlphanumeric()
  @IsString()
  @Length(6, 12)
  username: string;

  @IsAlphanumeric()
  @IsString()
  @Length(6, 12)
  password: string;

  @IsEmail()
  @Length(5, 50)
  email: string;

  @IsAlpha()
  @IsString()
  @Length(3, 20)
  fullName: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  age: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  isAdmin: string;

  @IsString()
  @IsOptional()
  address: string;
}
