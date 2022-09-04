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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { multerOptions } from '../../utils/util.multer';
import { uploadFileDto } from './dto/dto.fileUpload';
import { UpdatePictureDto } from './dto/dto.updatePicture.dto';
import { PictureService } from './picture.service';

@ApiBearerAuth()
@ApiTags('Picture')
@Controller()
export class PictureController {
  constructor(private pictureService: PictureService) {}

  @Get('picture')
  async showListPicture() {
    return this.pictureService.showListPicture();
  }

  @Get('picture/:pictureId')
  async showPictureByID(@Param('pictureId') pictureId: string) {
    return this.pictureService.showPictureByID(pictureId);
  }

  @Get('picture/product/:productId')
  async showPictureByProductID(@Param('productId') productId: string) {
    return this.pictureService.showPictureByProductID(productId);
  }

  @Post('admin/picture')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Banner',
    type: uploadFileDto,
  })
  async uploadPicture(@UploadedFile() file, @Body() requestBody: any) {
    return this.pictureService.uploadPicture(file, requestBody);
  }

  @Patch('admin/picture/:pictureId')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async updatePicture(
    @Body() requestBody: UpdatePictureDto,
    @Param('pictureId') pictureId: string,
  ) {
    return this.pictureService.updatePicture(pictureId, requestBody);
  }

  @Delete('admin/picture/:pictureId')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async deletePictureByID(@Param('pictureId') pictureId: string) {
    return this.pictureService.deletePicture(pictureId);
  }
}
