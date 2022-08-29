import { userGender, userRole, userStatus } from 'src/commons/common.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
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

  @Column({
    type: 'enum',
    enum: userGender,
    default: userGender.MALE,
  })
  gender: userGender;

  @Column({ nullable: true })
  age: string;

  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.MEMBER,
  })
  role: userRole;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: userStatus,
    default: userStatus.NOTACTIVE,
  })
  accountStatus: userStatus;
}
