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
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/dto.create';
import { UpdateCategoryDto } from './dto/dto.update';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private cateService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Member')
  @Post('create')
  async createNewCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.cateService.createNewCategory(createCategoryDto);
  }

  @Get('all')
  async getList() {
    return this.cateService.getList();
  }

  @Get(':categoryID')
  async findCategoryByID(@Param('categoryID') categoryID: string) {
    return this.cateService.findCategoryByID({ categoryID });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Member')
  @Patch(':categoryID')
  async updateCategoryInfo(
    @Param('categoryID') categoryID: string,
    @Body() requestBody: UpdateCategoryDto,
  ) {
    return this.cateService.updateCategoryInfo({ categoryID }, requestBody);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Member')
  @Delete(':categoryID')
  async deleteCategoryByID(@Param('categoryID') categoryID: string) {
    await this.cateService.deleteCategoryByID({ categoryID });
    return 'Delete category successful!';
  }
}
