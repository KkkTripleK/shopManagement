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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { userRole } from 'src/commons/common.enum';
import { multerOptions } from '../../utils/util.multer';
import { Roles } from '../decorators/decorator.roles';
import { JWTandRolesGuard } from '../guards/guard.roles';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/dto.create';
import { UpdateCategoryDto } from './dto/dto.update';

@ApiBearerAuth()
@ApiTags('Category')
@Controller()
export class CategoryController {
  constructor(private cateService: CategoryService) {}

  @Get('category/all')
  async showList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
  ): Promise<Pagination<CategoryEntity>> {
    return this.cateService.showList({
      page,
      limit,
      route: `localhost:${process.env.PORT}/category/all`,
    });
  }

  @Get('category/:categoryID')
  async findCategoryByID(@Param('categoryID') categoryID: string) {
    return this.cateService.findCategoryByID(categoryID);
  }

  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  @Post('admin/category/create')
  async createNewCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.cateService.createNewCategory(createCategoryDto);
  }

  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  @Post('admin/category/upload-banner')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file, @Body() requestBody: any) {
    return this.cateService.uploadBanner(file, requestBody);
  }

  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  @Patch('admin/category/:categoryID')
  async updateCategoryInfo(
    @Param('categoryID') categoryID: string,
    @Body() requestBody: UpdateCategoryDto,
  ) {
    return this.cateService.updateCategoryInfo(categoryID, requestBody);
  }

  @UseGuards(JWTandRolesGuard)
  @Roles(userRole.ADMIN)
  @Delete('admin/category/:categoryID')
  async inactiveCategoryByID(@Param('categoryID') categoryID: string) {
    await this.cateService.inactiveCategoryByID(categoryID);
    return `Status of categoryID ${categoryID} is Inactive!`;
  }
}
