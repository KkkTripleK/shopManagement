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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { multerOptions } from '../../utils/util.multer';
import { Roles } from '../decorators/decorator.roles';
import { JWTandRolesGuard } from '../guards/guard.roles';
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
    await this.pictureService.showPictureByProductID(productId);
    return 'Delete picture successful!';
  }

  @Post('admin/picture')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadPicture(@UploadedFile() file, @Body() requestBody: any) {
    return this.pictureService.uploadPicture(file, requestBody);
  }

  @Patch('admin/picture')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async updatePicture(@Body() requestBody: UpdatePictureDto) {
    return this.pictureService.updatePicture(requestBody);
  }

  @Delete('admin/picture/:pictureId')
  async deletePictureByID(@Param('pictureId') pictureId: string) {
    return this.pictureService.deletePicture(pictureId);
  }
}
