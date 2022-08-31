import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { UserEntity } from '../users/user.entity';
import { UserRepository } from '../users/user.repo';
import { PictureController } from './picture.controller';
import { PictureEntity } from './picture.entity';
import { PictureRepository } from './picture.repository';
import { PictureService } from './picture.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserEntity, PictureEntity]),
    MulterModule,
  ],
  controllers: [PictureController],
  providers: [
    PictureService,
    VerifyToken,
    JwtService,
    UserRepository,
    PictureRepository,
  ],
})
export class PictureModule {}
