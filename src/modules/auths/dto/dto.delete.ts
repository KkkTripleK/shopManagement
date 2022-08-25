import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeleteUser {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;
}
