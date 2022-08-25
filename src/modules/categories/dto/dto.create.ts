import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreateCategoryDto {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  categoryID: string;

  @ApiProperty()
  @IsString()
  @Length(6, 12)
  name: string;

  @ApiProperty()
  @IsString()
  banner: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  position: string;
}
