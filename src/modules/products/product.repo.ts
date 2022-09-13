import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DataSource, Repository } from 'typeorm';
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
        private dataSource: DataSource,
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
        try {
            return this.productRepo.findOne({
                where: [id],
                relations: {
                    category: true,
                    pictures: true,
                },
            });
        } catch (error) {
            throw new BadRequestException('ProductID is invalid!');
        }
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

        if (productInfo.qtyInstock < productInfo.qtyRemaining) {
            throw new BadRequestException('Quantity remaining can not be more then quantity instock!');
        }
        if (productInfo.status === productStatus.STOCK && productInfo.qtyRemaining === 0) {
            productInfo.status = productStatus.OUTSTOCK;
        } else if (productInfo.status === productStatus.OUTSTOCK && productInfo.qtyRemaining !== 0) {
            productInfo.status = productStatus.STOCK;
        }
        // return this.productRepo.manager.save(productInfo)
        // await this.dataSource
        //     .createQueryBuilder()
        //     .update(ProductEntity)
        //     .set(requestBody)
        //     .where('id =:id', { id: productInfo.id })
        //     .execute();
        return productInfo;
    }

    async addProductToCategory(categoryId: string, productId: string) {
        const productInfo = await this.adminShowProductByID({ id: productId });
        productInfo.category = await this.categoryRepo.findCategoryByID(categoryId);
        return this.productRepo.save(productInfo);
    }

    async findProductByParam(param: object) {
        return this.productRepo.findOne({ where: [param] });
    }
}
