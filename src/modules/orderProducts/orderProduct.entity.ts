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
import { OrderEntity } from '../orders/order.entity';
import { ProductEntity } from '../products/product.entity';

@Entity('OrderProducts')
export class OrderProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OrderEntity)
    @JoinColumn({
        name: 'fk_Order',
        referencedColumnName: 'id',
    })
    fk_Order: OrderEntity;

    @ManyToOne(() => ProductEntity)
    @JoinColumn({
        name: 'fk_Product',
        referencedColumnName: 'id',
    })
    fk_Product: ProductEntity;

    @Column({ default: '1' })
    qty: string;

    @Column()
    price: number;

    @Column()
    totalPrice: number;

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
