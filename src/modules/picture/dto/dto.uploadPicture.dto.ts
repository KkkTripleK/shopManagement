import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class UploadPictureDto {
  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty()
  @IsOptional()
  product?: object;
}
