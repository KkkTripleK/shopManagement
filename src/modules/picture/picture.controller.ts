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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { userRole } from '../../commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { multerOptions } from '../../utils/util.multer';
import { uploadFileDto } from './dto/dto.fileUpload';
import { UpdatePictureDto } from './dto/dto.updatePicture.dto';
import { PictureEntity } from './picture.entity';
import { PictureService } from './picture.service';

@ApiBearerAuth()
@ApiTags('Picture')
@Controller()
export class PictureController {
    constructor(private pictureService: PictureService) {}

    @Get('picture')
    async showListPicture(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<PictureEntity>> {
        return this.pictureService.showListPicture({
            page,
            limit,
            route: `localhost:${process.env.PORT}/admin/list-account`,
        });
    }

    @Get('picture/:id')
    async showPictureByID(@Param('id') id: string) {
        return this.pictureService.showPictureByID(id);
    }

    @Get('picture/product/:id')
    async showPictureByid(@Param('id') id: string) {
        return this.pictureService.showPictureByProductID(id);
    }

    @Post('admin/picture')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiBadRequestResponse()
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @ApiBody({
        description: 'Picture',
        type: uploadFileDto,
    })
    async uploadPicture(@UploadedFile() file, @Body() requestBody: any) {
        return this.pictureService.uploadPicture(file, requestBody);
    }

    @Patch('admin/picture/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async updatePicture(@Body() requestBody: UpdatePictureDto, @Param('id') id: string) {
        return this.pictureService.updatePicture(id, requestBody);
    }

    @Delete('admin/picture/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async deletePictureByID(@Param('id') id: string) {
        return this.pictureService.deletePicture(id);
    }
}
