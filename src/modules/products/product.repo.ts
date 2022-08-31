import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryRepository } from '../categories/category.repo';
import { CreateProductDto } from './dto/dto.create.dto';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
    private categoryRepo: CategoryRepository,
  ) {}

  async createNewProduct(
    requestBody: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productRepo.save(requestBody);
  }

  async showListProduct(): Promise<ProductEntity[]> {
    return this.productRepo.find({
      relations: {
        category: true,
        pictures: true,
      },
    });
  }

  async adminShowListProduct(): Promise<ProductEntity[]> {
    const product = await this.productRepo.manager
      .createQueryBuilder(ProductEntity, 'product')
      .select(['product', 'product.cost'])
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.pictures', 'pictures')
      .getMany();
    return product;
  }

  async showProductByID(id: object): Promise<ProductEntity> {
    return this.productRepo.findOne({
      where: [id],
      relations: {
        category: true,
        pictures: true,
      },
    });
  }

  async adminShowProductByID(id: object): Promise<ProductEntity> {
    const product = await this.productRepo.manager
      .createQueryBuilder(ProductEntity, 'product')
      .select(['product', 'product.cost'])
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.pictures', 'pictures')
      .where('product.id = :id', id)
      .getOne();
    if (product === null) {
      throw new HttpException('ProductID is invalid!', HttpStatus.BAD_REQUEST);
    }
    return product;
  }

  async updateProductByID(id: string, requestBody: object) {
    const productInfo = await this.adminShowProductByID({ id });
    for (const key in requestBody) {
      productInfo[key] = requestBody[key];
    }
    return this.productRepo.save(productInfo);
  }

  async addProductToCategory(categoryId: string, productId: string) {
    const productInfo = await this.adminShowProductByID({ id: productId });
    productInfo.category = await this.categoryRepo.findCategoryByID(categoryId);
    return this.productRepo.save(productInfo);
  }
}
