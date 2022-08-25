import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  productID: string;

  @Column()
  categoryID: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  barcode: string;

  @Column()
  cost: string;

  @Column()
  netPrice: string;

  @Column()
  salePrice: string;

  @Column()
  weight: string;

  @Column()
  qtyInstock: string;

  @Column()
  description: string;

  @Column()
  status: string;
}
