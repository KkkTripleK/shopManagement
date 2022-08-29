import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  // eslint-disable-next-line prettier/prettier
  PrimaryGeneratedColumn
} from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';

@Entity('Products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  productID: string;

  @Column({ nullable: true })
  categoryID: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ select: false })
  cost: string;

  @Column()
  netPrice: string;

  @Column({ nullable: true })
  salePrice: string;

  @Column()
  weight: string;

  @Column()
  qtyInstock: string;

  @Column({ nullable: true })
  qtyRemaining: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @ManyToOne(() => CategoryEntity, (categoryEntity) => categoryEntity.product)
  categoryEntity: CategoryEntity;
}
