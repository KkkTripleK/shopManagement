import { productStatus } from 'src/commons/common.enum';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  // eslint-disable-next-line prettier/prettier
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';
import { PictureEntity } from '../picture/picture.entity';

@Entity('Products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

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

  @Column({
    type: 'enum',
    enum: productStatus,
    default: productStatus.STOCK,
  })
  status: productStatus;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;

  @OneToMany(() => PictureEntity, (picture) => picture.product)
  pictures: PictureEntity[];
}
