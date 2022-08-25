import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repo';
import { CreateCategoryDto } from './dto/dto.create';
import { UpdateCategoryDto } from './dto/dto.update';

@Injectable()
export class CategoryService {
  constructor(private cateRepo: CategoryRepository) {}

  async createNewCategory(createCategoryDto: CreateCategoryDto) {
    await this.checkValidPosition(createCategoryDto.position);
    return this.cateRepo.createNewCategory(createCategoryDto);
  }
  async getList() {
    return this.cateRepo.getList();
  }

  async updateCategoryInfo(categoryID: object, param: UpdateCategoryDto) {
    if (param.position) {
      await this.checkValidPosition(param.position);
    }
    return this.cateRepo.updateCategoryInfo(categoryID, param);
  }

  async findCategoryByID(categoryID: object) {
    return this.cateRepo.findCategoryByID(categoryID);
  }

  async deleteCategoryByID(categoryID: object) {
    const checkExistCategoryID = await this.findCategoryByID(categoryID);
    if (!checkExistCategoryID) {
      throw new HttpException('CategoryID invalid!', HttpStatus.BAD_REQUEST);
    }
    await this.cateRepo.deleteByID(categoryID);
  }

  async checkValidPosition(position: string) {
    const categoriesInfo = await this.getList();
    for (const category of categoriesInfo) {
      if (category.position === position) {
        throw new HttpException(
          'The position is used!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
