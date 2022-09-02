import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CategoryEntity } from './category.entity';
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
  async showList(
    options?: IPaginationOptions,
  ): Promise<Pagination<CategoryEntity>> {
    return this.cateRepo.showList(options);
  }

  async updateCategoryInfo(categoryID: string, param: UpdateCategoryDto) {
    if (param.position) {
      await this.checkValidPosition(param.position);
    }
    return this.cateRepo.updateCategoryInfo(categoryID, param);
  }

  async findCategoryByID(categoryID: string) {
    return this.cateRepo.findCategoryByID(categoryID);
  }

  async inactiveCategoryByID(categoryID: string) {
    const checkExistCategoryID = await this.findCategoryByID(categoryID);
    if (!checkExistCategoryID) {
      throw new HttpException('CategoryID invalid!', HttpStatus.BAD_REQUEST);
    }
    await this.cateRepo.updateCategoryInfo(categoryID, { status: 'Inactive' });
  }

  async checkValidPosition(position: string) {
    const categoriesInfo = await this.cateRepo.getList();
    for (const category of categoriesInfo) {
      if (category.position === position) {
        throw new HttpException(
          'The position is already used!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async deletePictureFromAssets(path: string) {
    fs.unlinkSync(path);
  }

  async uploadBanner(file, requestBody) {
    const productInfo = await this.cateRepo.findCategoryByID(
      requestBody.productId,
    );
    if (productInfo === null) {
      this.deletePictureFromAssets(file.path);
      throw new HttpException('ProductId is invalid!', HttpStatus.BAD_REQUEST);
    } else if (productInfo.banner !== null) {
      this.deletePictureFromAssets(productInfo.banner);
    }
    return this.cateRepo.updateCategoryInfo(requestBody.productId, {
      banner: file.path,
    });
  }
}
