import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CouponEntity } from '../coupons/coupon.entity';
import { UserEntity } from '../users/user.entity';

@Entity()
export class CouponUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'fk_User',
    referencedColumnName: 'id',
  })
  fk_User: UserEntity;

  @OneToOne(() => CouponEntity)
  @JoinColumn({
    name: 'fk_Coupon',
    referencedColumnName: 'id',
  })
  fk_Coupon: CouponEntity;
}
