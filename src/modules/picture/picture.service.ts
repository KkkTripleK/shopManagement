import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePictureDto } from './dto/dto.updatePicture.dto';
import { PictureRepository } from './picture.repository';

@Injectable()
export class PictureService {
  constructor(private pictureRepo: PictureRepository) {
    //
  }
  async uploadPicture(file, requestBody) {
    return this.pictureRepo.uploadPicture({
      filename: file.filename,
      path: file.path,
      product: { id: Number(requestBody.productId) },
    });
  }

  async updatePicture(param: UpdatePictureDto) {
    return this.pictureRepo.updatePicture(param);
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
    console.log(pictureInfo);
    if (pictureInfo === null) {
      throw new HttpException('PictureId is invalid!', HttpStatus.BAD_REQUEST);
    }
    return pictureInfo;
  }

  async deletePicture(pictureId: string) {
    const pictureInfo = await this.pictureRepo.deletePicture(pictureId);
    if (pictureInfo.affected === 0) {
      throw new HttpException('PictureID is invalid!', HttpStatus.BAD_REQUEST);
    }
    return 'Delete picture successful!';
  }
}
