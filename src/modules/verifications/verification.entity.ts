import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Verification')
export class VerificationEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    verificationID: string;

    @Column()
    username: string;

    @Column({ nullable: true })
    activeCode: string;
}
