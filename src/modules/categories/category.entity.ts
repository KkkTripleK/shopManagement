import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';

@Entity('Categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  banner: string;

  @Column()
  status: string;

  @Column()
  position: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
// @ManyToOne(() => CategoryEntity)
// @JoinColumn({ name: 'fkCategoryId' })
// category: CategoryEntity;
