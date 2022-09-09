import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { orderStatus, productStatus } from '../../commons/common.enum';
import { FlashSaleProductService } from '../flashSaleProducts/flashSaleProduct.service';
import { FlashSaleEntity } from '../flashSales/flashSale.entity';
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
        private flashSaleProductService: FlashSaleProductService,
    ) {}

    async createNewProduct(requestBody: CreateProductDto): Promise<ProductEntity> {
        if (Number(requestBody.qtyRemaining) >= Number(requestBody.qtyInstock)) {
            throw new BadRequestException('Quantity remaining can not be more then quantity instock!');
        } else if (Number(requestBody.qtyRemaining) === 0) {
            requestBody.status = productStatus.OUTSTOCK;
        }
        return this.productRepository.createNewProduct(requestBody);
    }

    async showListProduct(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        return this.productRepository.showListProduct(options);
    }

    async findProductByName(options: IPaginationOptions, nameProduct: string): Promise<Pagination<ProductEntity>> {
        return this.productRepository.findProductByName(options, nameProduct);
    }

    async adminShowListProduct(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        return this.productRepository.adminShowListProduct(options);
    }

    async showProductByID(productID: string): Promise<ProductEntity> {
        const result = await this.productRepository.showProductByProductId({
            id: productID,
        });
        if (result === null) {
            throw new BadRequestException('ProductID is invalid!');
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

    async inFlashSale(flashSaleInfo: FlashSaleEntity) {
        const listFlashSaleProductInfo = await this.flashSaleProductService.getFlashSaleProductByFlashSaleId(
            flashSaleInfo.id,
        );
        for (const flashSaleProductInfo of listFlashSaleProductInfo) {
            const productInfo = await this.showProductByID(flashSaleProductInfo.fk_Product.id);
            const newPrice = (productInfo.price * (100 - flashSaleProductInfo.discount)) / 100;
            try {
                await this.updateProductByID(productInfo.id, { price: newPrice });
            } catch (error) {
                console.log(error);
            }
        }
        console.log('FlashSale is comming!');
    }

    async flashSaleOver(flashSaleInfo: FlashSaleEntity) {
        const listFlashSaleProductInfo = await this.flashSaleProductService.getFlashSaleProductByFlashSaleId(
            flashSaleInfo.id,
        );
        for (const flashSaleProductInfo of listFlashSaleProductInfo) {
            const productInfo = await this.showProductByID(flashSaleProductInfo.fk_Product.id);
            const newPrice = (productInfo.price / (100 - flashSaleProductInfo.discount)) * 100;
            await this.updateProductByID(productInfo.id, { price: newPrice });
        }
        console.log('FlashSale is end!');
    }

    async inactiveProductByID(productID: string) {
        /* 
        1. Change status of product
        2. Find orderProducts and Orders are containing a deleted product
        3. Check status of Orders, status === Shopping --> Update
        4. Update price of Order
        5. Delete orderProduct
        */

        // Step 1. Change status of product
        await this.productRepository.updateProductByID(productID, {
            status: productStatus.INACTIVE,
        });
        // Step 2. Find orderProducts and Orders are containing a deleted product
        const listOrderProductInfo = await this.orderProductRepo.getListOrderProductByProductId(productID);
        for (const orderProductInfo of listOrderProductInfo) {
            if (orderProductInfo.fk_Order.status === orderStatus.SHOPPING) {
                await this.orderProductService.adminDeleteOrderProductInOrder(orderProductInfo.id);
            }
        }
    }

    async addProductToCategory(requestBody: AddProductToCategoryDto) {
        return this.productRepository.addProductToCategory(requestBody.categoryId, requestBody.productId);
    }
}
