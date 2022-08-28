import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreateCategoryDto {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  categoryID: string;

  @ApiProperty()
  @IsString()
  @Length(0, 12)
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  banner?: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  position: string;
}
