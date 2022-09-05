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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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
      route: `localhost:${process.env.PORT}/admin/list-account`,
    });
  }

  @Get('product/:productID')
  async showProductByID(
    @Param('productID') productID: string,
  ): Promise<ProductEntity> {
    return this.productService.showProductByID(productID);
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
      route: `localhost:${process.env.PORT}/admin/list-account`,
    });
  }

  @Get('/admin/product/:productID')
  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  async adminShowProductByID(
    @Param('productID') productID: string,
  ): Promise<ProductEntity> {
    return this.productService.adminShowProductByID(productID);
  }

  @Post('admin/product/create')
  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async createNewProduct(
    @Body() requestBody: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createNewProduct(requestBody);
  }

  @Patch('admin/product/:productID')
  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async updateProductByID(
    @Param('productID') productID: string,
    @Body() requestBody: UpdateProductDto,
  ) {
    return this.productService.updateProductByID(productID, requestBody);
  }

  @Post('admin/product/addToCate')
  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
