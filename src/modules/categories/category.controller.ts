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
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { userRole } from '../../commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { multerOptions } from '../../utils/util.multer';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/dto.create';
import { uploadFileDto } from './dto/dto.fileUpload';
import { UpdateCategoryDto } from './dto/dto.update';

@ApiBearerAuth()
@ApiTags('Category')
@Controller()
export class CategoryController {
    constructor(private cateService: CategoryService) {}

    @Get('category/all')
    @ApiQuery({
        name: 'limit',
        type: 'number',
    })
    @ApiQuery({
        name: 'page',
        type: 'number',
    })
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async showList(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<CategoryEntity>> {
        return this.cateService.showList({
            page,
            limit,
            route: `localhost:${process.env.PORT}/api/v1/category/all/`,
        });
    }

    @Get('category/single/:categoryID')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async findCategoryByID(@Param('categoryID') categoryID: string) {
        return this.cateService.findCategoryByID(categoryID);
    }

    @Post('admin/category/create')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async createNewCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.cateService.createNewCategory(createCategoryDto);
    }

    @Post('admin/category/upload-banner')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @UseInterceptors(FileInterceptor('file', multerOptions))
    // @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Banner',
        type: uploadFileDto,
    })
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async uploadBanner(@UploadedFile() file, @Body() requestBody: any) {
        console.log(file);
        return this.cateService.uploadBanner(file, requestBody);
    }

    @Patch('admin/category/:categoryID')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async updateCategoryInfo(@Param('categoryID') categoryID: string, @Body() requestBody: UpdateCategoryDto) {
        return this.cateService.updateCategoryInfo(categoryID, requestBody);
    }

    @Delete('admin/category/:categoryID')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async inactiveCategoryByID(@Param('categoryID') categoryID: string) {
        await this.cateService.inactiveCategoryByID(categoryID);
        return `Status of categoryID ${categoryID} is Inactive!`;
    }
}
