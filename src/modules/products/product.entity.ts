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
import { productStatus } from '../../commons/common.enum';
import { CategoryEntity } from '../categories/category.entity';
import { FlashSaleProductEntity } from '../flashSaleProducts/flashSaleProduct.entity';
import { PictureEntity } from '../picture/picture.entity';

@Entity('Products')
export class ProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    barcode: string;

    @Column({ nullable: true, select: false })
    importPrice: number;

    @Column({ nullable: true })
    price: number;

    @Column()
    weight: string;

    @Column()
    qtyInstock: number;

    @Column({ nullable: true })
    qtyRemaining: number;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: productStatus,
        default: productStatus.STOCK,
    })
    status: productStatus;

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

    @ManyToOne(() => CategoryEntity, (category) => category.products)
    category: CategoryEntity;

    @OneToMany(() => PictureEntity, (picture) => picture.product)
    pictures: PictureEntity[];

    @OneToMany(() => FlashSaleProductEntity, (flashSaleProduct) => flashSaleProduct.fk_Product)
    @JoinColumn({
        name: 'fk_FlashSaleProduct',
        referencedColumnName: 'id',
    })
    fk_FlashSaleProduct: FlashSaleProductEntity[];
}
