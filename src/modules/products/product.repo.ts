import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { productStatus } from '../../commons/common.enum';
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

    async createNewProduct(requestBody: CreateProductDto): Promise<ProductEntity> {
        return this.productRepo.save(requestBody);
    }

    async showListProduct(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        const listProduct = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.pictures', 'pictures')
            .leftJoinAndSelect('product.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'product',
                'pictures',
                'category.id',
                'category.name',
                'category.banner',
                'category.status',
                'category.position',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.status',
                'fk_FlashSaleProduct.discount',
                'fk_FlashSaleProduct.totalQty',
                'fk_FlashSaleProduct.qtyRemain',
            ])
            .where('product.status != :status', { status: productStatus.INACTIVE })
            .orderBy('product.id');
        return paginate<ProductEntity>(listProduct, options);
    }

    async findProductByName(options: IPaginationOptions, nameProduct: string): Promise<Pagination<ProductEntity>> {
        console.log(nameProduct);
        const listProduct = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.pictures', 'pictures')
            .leftJoinAndSelect('product.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'product',
                'pictures',
                'category.id',
                'category.name',
                'category.banner',
                'category.status',
                'category.position',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.status',
                'fk_FlashSaleProduct.discount',
                'fk_FlashSaleProduct.totalQty',
                'fk_FlashSaleProduct.qtyRemain',
            ])
            .where('product.name like :name', { name: `%${nameProduct}%` })
            .orderBy('product.id');
        return paginate<ProductEntity>(listProduct, options);
    }

    async adminShowListProduct(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        const listProduct = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.pictures', 'pictures')
            .leftJoinAndSelect('product.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'product',
                'product.importPrice',
                'pictures',
                'category.id',
                'category.name',
                'category.banner',
                'category.status',
                'category.position',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.status',
                'fk_FlashSaleProduct.discount',
                'fk_FlashSaleProduct.totalQty',
                'fk_FlashSaleProduct.qtyRemain',
            ])
            .orderBy('product.id');
        return paginate<ProductEntity>(listProduct, options);
    }

    async showProductByProductId(id: object): Promise<ProductEntity> {
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
            .select(['product', 'product.importPrice'])
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.pictures', 'pictures')
            .leftJoinAndSelect('product.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'product',
                'product.importPrice',
                'pictures',
                'category.id',
                'category.name',
                'category.banner',
                'category.status',
                'category.position',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.status',
                'fk_FlashSaleProduct.discount',
                'fk_FlashSaleProduct.totalQty',
                'fk_FlashSaleProduct.qtyRemain',
            ])
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
