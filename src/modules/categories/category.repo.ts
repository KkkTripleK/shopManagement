import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dto/dto.create';
import { UpdateCategoryDto } from './dto/dto.update';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private cateRepo: Repository<CategoryEntity>,
  ) {}

  async createNewCategory(createCategoryDto: CreateCategoryDto) {
    return await this.cateRepo.save(createCategoryDto);
  }

  async getList(): Promise<CategoryEntity[]> {
    const listCategory = await this.cateRepo.manager
      .createQueryBuilder(CategoryEntity, 'category')
      .leftJoinAndSelect('category.products', 'photo')
      .orderBy('position')
      .getMany();
    return listCategory;
  }

  async deleteByID(id: string): Promise<any> {
    this.cateRepo.delete({ id });
  }

  async updateCategoryInfo(
    id: string,
    param: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const categoryInfo = await this.cateRepo.findOneBy({ id });
    for (const key in param) {
      categoryInfo[key] = param[key];
    }
    return this.cateRepo.save(categoryInfo);
  }

  async findCategoryByID(id: string): Promise<CategoryEntity> {
    const categoryInfo = await this.cateRepo.findOne({
      where: [{ id }],
      relations: {
        products: true,
      },
    });
    if (categoryInfo === null) {
      throw new HttpException('CategoryID is invalid!', HttpStatus.BAD_REQUEST);
    }
    return categoryInfo;
  }
}
