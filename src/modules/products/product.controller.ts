import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/decorator.roles';
import { JWTandRolesGuard } from '../guards/guard.roles';
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
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async adminShowListProduct(): Promise<ProductEntity[]> {
    return this.productService.adminShowListProduct();
  }

  @Get('/admin/product/:productID')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async adminShowProductByID(
    @Param('productID') productID: string,
  ): Promise<ProductEntity> {
    return this.productService.adminShowProductByID(productID);
  }

  @Post('admin/product/create')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async createNewProduct(
    @Body() requestBody: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createNewProduct(requestBody);
  }

  @Patch('admin/product/:productID')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async updateProductByID(
    @Param('productID') productID: string,
    @Body() requestBody: UpdateProductDto,
  ) {
    return this.productService.updateProductByID(productID, requestBody);
  }

  @Delete('admin/product/:productID')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async deleteProductByID(@Param('productID') productID: string) {
    await this.productService.deleteProductByID(productID);
    return 'Delete product successful!';
  }
}
