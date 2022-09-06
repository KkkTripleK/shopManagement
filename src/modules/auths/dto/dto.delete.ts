import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';

export class DeleteUser {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;
}
