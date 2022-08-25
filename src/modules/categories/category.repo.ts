import { Injectable } from '@nestjs/common';
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
      .orderBy('position')
      .getMany();
    return listCategory;
  }

  async deleteByID(categoryID: object): Promise<any> {
    this.cateRepo.delete(categoryID);
  }

  async updateCategoryInfo(
    categoryID: object,
    param: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const categoryInfo = await this.cateRepo.findOneBy(categoryID);
    for (const key in param) {
      categoryInfo[key] = param[key];
    }
    return this.cateRepo.save(categoryInfo);
  }

  async findCategoryByID(categoryID: object): Promise<CategoryEntity> {
    const categoryInfo = await this.cateRepo.findOne({ where: [categoryID] });
    return categoryInfo;
  }
}

//   async getUserByID(id: number): Promise<User> {
//     const found = await this.cateRepo.findOne(id);
//     if (!found) {
//       throw new NotFoundException(`Can not find user ${id} `);
//     }
//     return found;
//   }
// @Patch('/info')
// async updateInfo(@Body() param: UpdateDTO): Promise<UserEntity> {
//   const username = 'hoaNK97122';
//   console.log(param);
//   return await this.authService.updateInfo({ username }, param);
// }

// @Delete('remove')
// userDelete(@Body() removeID: DeleteUser): Promise<object> {
//   return this.authService.deleteItem(removeID);
// }

// @Patch('update')
// update(@Body() param: UpdateDTO): Promise<UpdateDTO> {
//   console.log(param);
//   return this.authService.updateInfo({ id: '10' }, param);
// }

// @Get('sendMail')
// sendMail(): void {
//   return this.mailService.example();
// }

// @Get(':id')
// getUserByID(@Param('id') id: string): Promise<object> {
//   return this.authService.getUserByID(id);
// }

// @Get('/:id')
// getUserByID(@Param('id', ParseIntPipe) id: number): Promise<User> {
//   return this.authService.getUserByID(id);
// }
