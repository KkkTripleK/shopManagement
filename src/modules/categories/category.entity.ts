import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  // eslint-disable-next-line prettier/prettier
  PrimaryGeneratedColumn
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';

@Entity('Categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  categoryID: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  banner: string;

  @Column()
  status: string;

  @Column()
  position: string;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.categoryID)
  product: ProductEntity;
}
