import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { productStatus } from 'src/commons/common.enum';
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

    async createNewProduct(requestBody: CreateProductDto): Promise<ProductEntity> {
        return this.productRepo.save(requestBody);
    }

    async showListProduct(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        return paginate<ProductEntity>(this.productRepo, options, {
            where: [{ status: productStatus.STOCK }, { status: productStatus.OUTSTOCK }],
            relations: ['category', 'pictures'],
        });
    }

    async adminShowListProduct(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        const queryBuilder = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.pictures', 'pictures')
            .select(['product', 'product.cost', 'pictures', 'category']);
        return paginate<ProductEntity>(queryBuilder, options);
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
