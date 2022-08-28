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

  async showProductByID(productID: object): Promise<ProductEntity> {
    return this.productRepo.findOne({ where: [productID] });
  }

  async adminShowProductByID(productID: object): Promise<ProductEntity> {
    const product = await this.productRepo.manager
      .createQueryBuilder(ProductEntity, 'product')
      .select(['product', 'product.cost'])
      .where('product.productID = :productID', productID)
      .getOne();
    if (product === null) {
      throw new HttpException('ProductID is invalid!', HttpStatus.BAD_REQUEST);
    }
    return product;
  }

  async updateProductByID(productID: string, requestBody: UpdateProductDto) {
    const productInfo = await this.adminShowProductByID({ productID });
    for (const key in requestBody) {
      productInfo[key] = requestBody[key];
    }
    return this.productRepo.save(productInfo);
  }

  async deleteProductByID(productID: string) {
    return this.productRepo.delete({ productID });
  }

  async uploadPictureForProduct() {
    //
  }
}
