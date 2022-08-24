import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeleteUser {
  @PrimaryGeneratedColumn()
  id: string;
}
