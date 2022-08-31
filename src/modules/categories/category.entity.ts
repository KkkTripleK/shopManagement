import { categoryStatus } from 'src/commons/common.enum';
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

  @Column({
    type: 'enum',
    enum: categoryStatus,
    default: categoryStatus.ACTIVE,
  })
  status: categoryStatus;

  @Column()
  position: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
