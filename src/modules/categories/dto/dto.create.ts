import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { categoryStatus } from '../../../commons/common.enum';

export class CreateCategoryDto {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    categoryID: string;

    @ApiProperty()
    @IsString()
    @Length(0, 12)
    name: string;

    @ApiProperty({ required: false })
    @IsEnum(categoryStatus)
    @IsOptional()
    status?: categoryStatus;

    @ApiProperty()
    @IsString()
    position: string;
}
