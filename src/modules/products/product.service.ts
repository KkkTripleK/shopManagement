import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddProductToCategoryDto } from './dto/dto.addToCategory.dto';
import { CreateProductDto } from './dto/dto.create.dto';
import { UpdateProductDto } from './dto/dto.update.dto';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repo';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async createNewProduct(
    requestBody: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productRepository.createNewProduct(requestBody);
  }

  async showListProduct(): Promise<ProductEntity[]> {
    return this.productRepository.showListProduct();
  }

  async adminShowListProduct(): Promise<ProductEntity[]> {
    return this.productRepository.adminShowListProduct();
  }

  async showProductByID(productID: string): Promise<ProductEntity> {
    const result = await this.productRepository.showProductByID({ productID });
    if (result === null) {
      throw new HttpException('ProductID is invalid!', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  async adminShowProductByID(productID: string): Promise<ProductEntity> {
    return this.productRepository.adminShowProductByID({ id: productID });
  }
  async updateProductByID(productID: string, requestBody: UpdateProductDto) {
    return this.productRepository.updateProductByID(productID, requestBody);
  }

  async deactiveProductByID(productID: string) {
    await this.productRepository.updateProductByID(productID, {
      status: 'Deactive',
    });
  }

  async addProductToCategory(requestBody: AddProductToCategoryDto) {
    return this.productRepository.addProductToCategory(
      requestBody.categoryId,
      requestBody.productId,
    );
  }
}
