import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { productStatus } from 'src/commons/common.enum';
import { OrderService } from '../orders/order.service';
import { AddProductToCategoryDto } from './dto/dto.addToCategory.dto';
import { CreateProductDto } from './dto/dto.create.dto';
import { UpdateProductDto } from './dto/dto.update.dto';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repo';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private orderService: OrderService,
  ) {}

  async createNewProduct(
    requestBody: CreateProductDto,
  ): Promise<ProductEntity> {
    if (Number(requestBody.qtyRemaining) >= Number(requestBody.qtyInstock)) {
      throw new HttpException(
        'Quantity remaining can not be more then quantity instock!',
        HttpStatus.BAD_REQUEST,
      );
    } else if (Number(requestBody.qtyRemaining) === 0) {
      requestBody.status = productStatus.OUTSTOCK;
    }
    return this.productRepository.createNewProduct(requestBody);
  }

  async showListProduct(
    options: IPaginationOptions,
  ): Promise<Pagination<ProductEntity>> {
    return this.productRepository.showListProduct(options);
  }

  async adminShowListProduct(
    options: IPaginationOptions,
  ): Promise<Pagination<ProductEntity>> {
    return this.productRepository.adminShowListProduct(options);
  }

  async showProductByID(productID: string): Promise<ProductEntity> {
    const result = await this.productRepository.showProductByProductId({
      id: productID,
    });
    if (result === null) {
      throw new HttpException('ProductID is invalid!', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  async adminShowProductByID(productID: string): Promise<ProductEntity> {
    return this.productRepository.adminShowProductByID({ id: productID });
  }

  async updateProductByID(productID: string, requestBody: UpdateProductDto) {
    const productInfo = await this.productRepository.updateProductByID(
      productID,
      requestBody,
    );
    await this.orderService.updateOrderInfoByProduct(productInfo);
  }

  async inactiveProductByID(productID: string) {
    await this.productRepository.updateProductByID(productID, {
      status: productStatus.INACTIVE,
    });
  }

  async addProductToCategory(requestBody: AddProductToCategoryDto) {
    return this.productRepository.addProductToCategory(
      requestBody.categoryId,
      requestBody.productId,
    );
  }
}
