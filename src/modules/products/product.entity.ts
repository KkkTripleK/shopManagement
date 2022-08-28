import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
