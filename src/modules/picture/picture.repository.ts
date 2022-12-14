import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { UpdatePictureDto } from './dto/dto.updatePicture.dto';
import { UploadPictureDto } from './dto/dto.uploadPicture.dto';
import { PictureEntity } from './picture.entity';

@Injectable()
export class PictureRepository {
    constructor(
        @InjectRepository(PictureEntity)
        private pictureRepo: Repository<PictureEntity>,
    ) {}

    async uploadPicture(pictureInfo: UploadPictureDto) {
        return this.pictureRepo.save(pictureInfo);
    }

    async updatePicture(pictureId, pictureInfo: UpdatePictureDto) {
        const info = await this.showPictureByID(pictureId);
        if (info === null) {
            throw new HttpException('PictureID is invalid!', HttpStatus.BAD_REQUEST);
        }
        for (const key in pictureInfo) {
            info[key] = pictureInfo[key];
        }
        return this.pictureRepo.save(info);
    }

    async showListPicture(options: IPaginationOptions): Promise<Pagination<PictureEntity>> {
        const listPicture = await this.pictureRepo.manager
            .createQueryBuilder(PictureEntity, 'picture')
            .leftJoinAndSelect('picture.product', 'product')
            .orderBy('product.id');
        return paginate<PictureEntity>(listPicture, options);
    }

    async showPictureByID(id: string) {
        return this.pictureRepo.findOne({ where: [{ id }] });
    }

    async showPictureByProductID(productId: string) {
        return this.pictureRepo.find({
            where: {
                product: {
                    id: productId,
                },
            },
        });
    }

    async deletePicture(id: string) {
        return this.pictureRepo.delete({ id });
    }
}
