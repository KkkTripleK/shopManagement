import { IsAlpha, IsOptional, IsString, Length } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class UpdateDTO {
  @IsAlpha()
  @IsString()
  @Length(3, 20)
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  age?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
