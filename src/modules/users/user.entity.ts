import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  age: string;

  @Column({ nullable: true, default: 'Not Active' })
  accountStatus: string;

  @Column({ nullable: true, default: 'Member' })
  role: string;

  @Column()
  address: string;
}
