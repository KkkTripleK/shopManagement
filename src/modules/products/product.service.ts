import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { orderStatus, productStatus } from 'src/commons/common.enum';
import { OrderProductRepository } from '../orderProducts/orderProduct.repo';
import { OrderProductService } from '../orderProducts/orderProduct.service';
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
        private orderProductRepo: OrderProductRepository,
        private orderProductService: OrderProductService,
    ) {}

    async createNewProduct(requestBody: CreateProductDto): Promise<ProductEntity> {
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

    async showListProduct(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        return this.productRepository.showListProduct(options);
    }

    async adminShowListProduct(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
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
        /* 
    1. Check exist product
    2. Change info of product
    3. Find orderProducts, Orders include product
    4. Check status of Orders
    5. Order.Status === Shopping --> Update info that orderProduct and Order
    */

        // Step 1. Check exist product & Step 2: Change info of product
        const productInfo = await this.productRepository.updateProductByID(productID, requestBody);
        await this.orderService.updateOrderInfoByProduct(productInfo);
    }

    async inactiveProductByID(productID: string) {
        /* 
    1. Change status of product
    2. Find orderProducts and Orders are containing a deleted product
    3. Check status of Orders, status === Shopping --> Update
    4. Delete orderProduct
    5. Update price of Order
    */

        // Step 1. Change status of product
        await this.productRepository.updateProductByID(productID, {
            status: productStatus.INACTIVE,
        });
        // Step 2. Find orderProducts and Orders are containing a deleted product
        // Step 2. Delete orderProducts containing a deleted product
        const listOrderProductInfo = await this.orderProductRepo.getListOrderProductByProductId(
            productID,
        );
        for (const orderProductInfo of listOrderProductInfo) {
            if (orderProductInfo.fk_Order.status === orderStatus.SHOPPING) {
                await this.orderProductService.adminDeleteOrderProductInOrder(orderProductInfo.id);
            }
        }
    }

    async addProductToCategory(requestBody: AddProductToCategoryDto) {
        return this.productRepository.addProductToCategory(
            requestBody.categoryId,
            requestBody.productId,
        );
    }
}
