import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  // eslint-disable-next-line prettier/prettier
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/decorator.roles';
import { JwtAuthGuard } from '../guards/guard.jwt';
import { RolesGuard } from '../guards/guard.roles';
import { CreateProductDto } from './dto/dto.create.dto';
import { UpdateProductDto } from './dto/dto.update.dto';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('product/all')
  async showListProduct(): Promise<ProductEntity[]> {
    return this.productService.showListProduct();
  }

  @Get('product/:productID')
  async showProductByID(
    @Param('productID') productID: string,
  ): Promise<ProductEntity> {
    return this.productService.showProductByID(productID);
  }

  @Get('admin/product/all')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async adminShowListProduct(): Promise<ProductEntity[]> {
    return this.productService.adminShowListProduct();
  }

  @Get('/admin/product/:productID')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async adminShowProductByID(
    @Param('productID') productID: string,
  ): Promise<ProductEntity> {
    return this.productService.adminShowProductByID(productID);
  }

  @Post('admin/product/create')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async createNewProduct(
    @Body() requestBody: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createNewProduct(requestBody);
  }

  @Patch('admin/product/:productID')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async updateProductByID(
    @Param('productID') productID: string,
    @Body() requestBody: UpdateProductDto,
  ) {
    return this.productService.updateProductByID(productID, requestBody);
  }

  @Delete('admin/product/:productID')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async deleteProductByID(@Param('productID') productID: string) {
    await this.productService.deleteProductByID(productID);
    return 'Delete product successful!';
  }

  @Post('admin/product/picture')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async uploadPictureForProduct() {
    //
  }
}
