import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';

@Entity('Picture')
export class PictureEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @ManyToOne(() => ProductEntity, (product) => product.pictures)
  product: ProductEntity;
}
