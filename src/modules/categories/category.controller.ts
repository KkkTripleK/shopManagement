import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  // eslint-disable-next-line prettier/prettier
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  async getList() {
    return this.cateService.getList();
  }

  @Get('category/:categoryID')
  async findCategoryByID(@Param('categoryID') categoryID: string) {
    return this.cateService.findCategoryByID({ categoryID });
  }

  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  @Post('admin/category/create')
  async createNewCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.cateService.createNewCategory(createCategoryDto);
  }

  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  @Patch('admin/category/:categoryID')
  async updateCategoryInfo(
    @Param('categoryID') categoryID: string,
    @Body() requestBody: UpdateCategoryDto,
  ) {
    return this.cateService.updateCategoryInfo({ categoryID }, requestBody);
  }

  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  @Delete('admin/category/:categoryID')
  async deleteCategoryByID(@Param('categoryID') categoryID: string) {
    await this.cateService.deleteCategoryByID({ categoryID });
    return 'Delete category successful!';
  }

  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  @Post('admin/category/upload-banner')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file) {
    return file;
  }
}
