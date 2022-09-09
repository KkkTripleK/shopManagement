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
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { userRole } from 'src/commons/common.enum';
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

    @ApiParam({
        name: 'limit',
    })
    @ApiParam({
        name: 'page',
    })
    @Get('category/all/:page/:limit')
    async showList(
        @Param('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Param('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<CategoryEntity>> {
        return this.cateService.showList({
            page,
            limit,
            route: `localhost:${process.env.PORT}/category/all`,
        });
    }

    @Get('category/:categoryID')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async findCategoryByID(@Param('categoryID') categoryID: string) {
        return this.cateService.findCategoryByID(categoryID);
    }

    @Post('admin/category/create')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async createNewCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.cateService.createNewCategory(createCategoryDto);
    }

    @Post('admin/category/upload-banner')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Banner',
        type: uploadFileDto,
    })
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async upload(@UploadedFile() file, @Body() requestBody: any) {
        return this.cateService.uploadBanner(file, requestBody);
    }

    @Patch('admin/category/:categoryID')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async updateCategoryInfo(@Param('categoryID') categoryID: string, @Body() requestBody: UpdateCategoryDto) {
        return this.cateService.updateCategoryInfo(categoryID, requestBody);
    }

    @Delete('admin/category/:categoryID')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async inactiveCategoryByID(@Param('categoryID') categoryID: string) {
        await this.cateService.inactiveCategoryByID(categoryID);
        return `Status of categoryID ${categoryID} is Inactive!`;
    }
}
