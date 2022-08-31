import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { categoryStatus } from 'src/commons/common.enum';
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
  @IsEnum(categoryStatus)
  @IsOptional()
  status?: categoryStatus;

  @ApiProperty()
  @IsString()
  position: string;
}
