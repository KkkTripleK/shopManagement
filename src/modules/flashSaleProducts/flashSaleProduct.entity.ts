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
import { flashSaleProductStatus } from '../../commons/common.enum';
import { FlashSaleEntity } from '../flashSales/flashSale.entity';
import { OrderEntity } from '../orders/order.entity';
import { ProductEntity } from '../products/product.entity';

@Entity('FlashSaleProduct')
export class FlashSaleProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProductEntity)
    @JoinColumn({
        name: 'fk_Product',
        referencedColumnName: 'id',
    })
    fk_Product: ProductEntity;

    @ManyToOne(() => FlashSaleEntity)
    @JoinColumn({
        name: 'fk_FlashSale',
        referencedColumnName: 'id',
    })
    fk_FlashSale: FlashSaleEntity;

    @ManyToOne(() => OrderEntity)
    @JoinColumn({
        name: 'fk_Order',
        referencedColumnName: 'id',
    })
    fk_Order: OrderEntity;

    @Column()
    discount: number;

    @Column()
    totalQty: number;

    @Column({ nullable: true, default: 10 })
    qtyRemain: number;

    @Column({
        type: 'enum',
        enum: flashSaleProductStatus,
        default: flashSaleProductStatus.ACTIVE,
    })
    status: flashSaleProductStatus;

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
