import { orderPayment, orderStatus } from 'src/commons/common.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('Orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'fk_Username',
    referencedColumnName: 'username',
  })
  fk_User: UserEntity;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: orderPayment,
    default: orderPayment.CASH,
  })
  payment: orderPayment;

  @Column()
  shipment: string;

  @Column({ nullable: true })
  totalPrice: string;

  @Column({
    type: 'enum',
    enum: orderStatus,
    default: orderStatus.SHOPPING,
  })
  status: orderStatus;

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
