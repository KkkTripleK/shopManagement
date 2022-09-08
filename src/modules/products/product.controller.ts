import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { userRole } from 'src/commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { AddProductToCategoryDto } from './dto/dto.addToCategory.dto';
import { CreateProductDto } from './dto/dto.create.dto';
import { UpdateProductDto } from './dto/dto.update.dto';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@ApiBearerAuth()
@ApiTags('Product')
@Controller()
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('product/all')
    async showListProduct(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<ProductEntity>> {
        return this.productService.showListProduct({
            page,
            limit,
            route: `localhost:${process.env.PORT}/product/all`,
        });
    }

    @Get('product/:productID')
    async showProductByID(@Param('productID') productID: string): Promise<ProductEntity> {
        return this.productService.showProductByID(productID);
    }

    @Get('product/find/:nameProduct')
    async findProductByName(
        @Param('nameProduct') nameProduct: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<ProductEntity>> {
        return this.productService.findProductByName(
            {
                page,
                limit,
                route: `localhost:${process.env.PORT}/product/all`,
            },
            nameProduct,
        );
    }

    @Get('admin/product/all')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async adminShowListProduct(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<ProductEntity>> {
        return this.productService.adminShowListProduct({
            page,
            limit,
            route: `localhost:${process.env.PORT}/admin/product/all`,
        });
    }

    @Get('/admin/product/:productID')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async adminShowProductByID(@Param('productID') productID: string): Promise<ProductEntity> {
        return this.productService.adminShowProductByID(productID);
    }

    @Post('admin/product/create')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async createNewProduct(@Body() requestBody: CreateProductDto): Promise<ProductEntity> {
        return this.productService.createNewProduct(requestBody);
    }

    @Patch('admin/product/:productID')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async updateProductByID(@Param('productID') productID: string, @Body() requestBody: UpdateProductDto) {
        await this.productService.updateProductByID(productID, requestBody);
        return `Update productID <${productID}> successful!`;
    }

    @Post('admin/product/addToCate')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async addProductToCategory(@Body() requestBody: AddProductToCategoryDto) {
        return this.productService.addProductToCategory(requestBody);
    }

    @Delete('admin/product/:productID')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async inactiveProductByID(@Param('productID') productID: string) {
        await this.productService.inactiveProductByID(productID);
        return 'Inactive product successful!';
    }
}
