import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class UpdateCategoryDto {
  @ApiProperty()
  @IsString()
  @Length(6, 12)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  banner?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  position?: string;
}
