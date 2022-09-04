import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ProductRepository } from '../products/product.repo';
import { UpdatePictureDto } from './dto/dto.updatePicture.dto';
import { PictureRepository } from './picture.repository';

@Injectable()
export class PictureService {
  constructor(
    private pictureRepo: PictureRepository,
    private productRepo: ProductRepository,
  ) {}

  async uploadPicture(file, requestBody) {
    const productInfo = await this.productRepo.showProductByProductId({
      id: requestBody.productId,
    });
    if (productInfo === null) {
      this.deletePictureFromAssets(file.path);
      throw new HttpException('ProductId is invalid!', HttpStatus.BAD_REQUEST);
    }
    return this.pictureRepo.uploadPicture({
      filename: file.filename,
      path: file.path,
      product: { id: Number(requestBody.productId) },
    });
  }

  async deletePictureFromAssets(path: string) {
    fs.unlinkSync(path);
  }

  async updatePicture(pictureId, param: UpdatePictureDto) {
    return this.pictureRepo.updatePicture(pictureId, param);
  }

  async showPictureByProductID(productID: string) {
    const pictureInfo = await this.pictureRepo.showPictureByProductID(
      productID,
    );
    if (pictureInfo.length === 0) {
      throw new HttpException('PictureId is invalid!', HttpStatus.BAD_REQUEST);
    }
    return pictureInfo;
  }

  async showListPicture() {
    return this.pictureRepo.showListPictureByCondition({
      relations: { product: true },
    });
  }

  async showPictureByID(pictureId: string) {
    const pictureInfo = await this.pictureRepo.showPictureByID(pictureId);
    if (pictureInfo === null) {
      throw new HttpException('PictureId is invalid!', HttpStatus.BAD_REQUEST);
    }
    return pictureInfo;
  }

  async deletePicture(pictureId: string) {
    const pictureInfo = await this.showPictureByID(pictureId);
    if (pictureInfo.path === null) {
      throw new HttpException('PictureId is invalid!', HttpStatus.BAD_REQUEST);
    }
    await this.deletePictureFromAssets(pictureInfo.path);
    const result = await this.pictureRepo.deletePicture(pictureId);
    if (result.affected === 0) {
      throw new HttpException('PictureID is invalid!', HttpStatus.BAD_REQUEST);
    }
    return 'Delete picture successful!';
  }
}
