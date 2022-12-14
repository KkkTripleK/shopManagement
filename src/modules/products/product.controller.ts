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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { userRole } from '../../commons/common.enum';
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

    @ApiQuery({
        name: 'limit',
        type: 'number',
    })
    @ApiQuery({
        name: 'page',
        type: 'number',
    })
    @Get('product')
    async showListProduct(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<ProductEntity>> {
        return this.productService.showListProduct({
            page,
            limit,
            route: `localhost:${process.env.PORT}/api/v1/product/all`,
        });
    }

    @Get('product/:id')
    async showProductByID(@Param('id') id: string): Promise<ProductEntity> {
        return this.productService.showProductByID(id);
    }

    @ApiQuery({
        name: 'limit',
    })
    @ApiQuery({
        name: 'page',
    })
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
                route: `localhost:${process.env.PORT}/api/v1/product/find/${nameProduct}`,
            },
            nameProduct,
        );
    }

    @ApiQuery({
        name: 'limit',
    })
    @ApiQuery({
        name: 'page',
    })
    @Get('admin/product')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async adminShowListProduct(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<ProductEntity>> {
        return this.productService.adminShowListProduct({
            page,
            limit,
            route: `localhost:${process.env.PORT}/api/v1/admin/product/all`,
        });
    }

    @Get('/admin/product/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async adminShowProductByID(@Param('id') id: string): Promise<ProductEntity> {
        return this.productService.adminShowProductByID(id);
    }

    @Post('admin/product/create')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async createNewProduct(@Body() requestBody: CreateProductDto): Promise<ProductEntity> {
        return this.productService.createNewProduct(requestBody);
    }

    @Patch('admin/product/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async updateProductByID(@Param('id') id: string, @Body() requestBody: UpdateProductDto) {
        await this.productService.updateProductByID(id, requestBody);
        return `Update productID <${id}> successful!`;
    }

    @Post('admin/product/addToCate')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async addProductToCategory(@Body() requestBody: AddProductToCategoryDto) {
        return this.productService.addProductToCategory(requestBody);
    }

    @Delete('admin/product/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    async inactiveProductByID(@Param('id') id: string) {
        await this.productService.inactiveProductByID(id);
        return 'Inactive product successful!';
    }
}
