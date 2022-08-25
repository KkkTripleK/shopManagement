import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  categoryID: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  banner: string;

  @Column()
  status: string;

  @Column()
  position: string;
}
