import { couponStatus } from 'src/commons/common.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Coupons')
export class CouponEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  totalQty: string;

  @Column({ default: '0', nullable: true })
  qtyRemain: string;

  @Column()
  discount: string;

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
