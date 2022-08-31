import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/dto.create.dto';
import { UpdateProductDto } from './dto/dto.update.dto';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {}

  async createNewProduct(
    requestBody: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productRepo.save(requestBody);
  }

  async showListProduct(): Promise<ProductEntity[]> {
    return this.productRepo.find();
  }

  async adminShowListProduct(): Promise<ProductEntity[]> {
    const product = await this.productRepo.manager
      .createQueryBuilder(ProductEntity, 'product')
      .select(['product', 'product.cost'])
      .getMany();
    return product;
  }

  async showProductByID(id: object): Promise<ProductEntity> {
    return this.productRepo.findOne({ where: [id] });
  }

  async adminShowProductByID(id: object): Promise<ProductEntity> {
    const product = await this.productRepo.manager
      .createQueryBuilder(ProductEntity, 'product')
      .select(['product', 'product.cost'])
      .where('product.id = :id', id)
      .getOne();
    if (product === null) {
      throw new HttpException('id is invalid!', HttpStatus.BAD_REQUEST);
    }
    return product;
  }

  async updateProductByID(id: string, requestBody: UpdateProductDto) {
    const productInfo = await this.adminShowProductByID({ id });
    for (const key in requestBody) {
      productInfo[key] = requestBody[key];
    }
    return this.productRepo.save(productInfo);
  }

  async deleteProductByID(id: string) {
    return this.productRepo.delete({ id });
  }
}
