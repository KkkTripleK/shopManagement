import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { couponStatus } from '../../commons/common.enum';

@Entity('Coupons')
export class CouponEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 0 })
    totalQty: number;

    @Column({ default: 0 })
    qtyRemain: number;

    @Column({ default: 0 })
    discount: number;

    @Column()
    begin: Date;

    @Column()
    end: Date;

    @Column({
        type: 'enum',
        enum: couponStatus,
        default: couponStatus.ACTIVE,
    })
    status: couponStatus;

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
