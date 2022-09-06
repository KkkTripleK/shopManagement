import { orderPayment, orderShipment, orderStatus } from 'src/commons/common.enum';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CouponEntity } from '../coupons/coupon.entity';
import { OrderProductEntity } from '../orderProducts/orderProduct.entity';
import { UserEntity } from '../users/user.entity';

@Entity('Orders')
export class OrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({
        name: 'fk_User',
        referencedColumnName: 'username',
    })
    fk_User: UserEntity;

    @ManyToOne(() => CouponEntity)
    @JoinColumn({
        name: 'fk_Coupon',
        referencedColumnName: 'id',
    })
    fk_Coupon: CouponEntity;

    @Column()
    address: string;

    //Regex
    @Column()
    phone: string;

    @Column({
        type: 'enum',
        enum: orderPayment,
        default: orderPayment.CASH,
    })
    payment: orderPayment;

    @Column({ default: 0 })
    totalProductPrice: number;

    @Column({
        type: 'enum',
        enum: orderShipment,
        default: orderShipment.VIETTELPOST,
    })
    shipment: orderShipment;

    @Column({ nullable: true, default: 0 })
    shipmentPrice: number;

    @Column({ nullable: true, default: 0 })
    totalOrderPrice: number;

    @Column({
        type: 'enum',
        enum: orderStatus,
        default: orderStatus.SHOPPING,
    })
    status: orderStatus;

    @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.fk_Order)
    @JoinColumn({
        name: 'fk_OrderProduct',
        referencedColumnName: 'id',
    })
    fk_OrderProduct: OrderProductEntity[];

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
