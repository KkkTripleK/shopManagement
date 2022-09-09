import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { userGender, userRole, userStatus } from '../../commons/common.enum';

@Entity('Users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ unique: true })
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

    @CreateDateColumn({
        default: `now()`,
        nullable: false,
    })
    createAt: string;

    @UpdateDateColumn({
        default: `now()`,
        nullable: true,
    })
    updateAt: string;
}
