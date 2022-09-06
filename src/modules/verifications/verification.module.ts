import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { VerificationController } from './verification.controller';
import { VerificationEntity } from './verification.entity';
import { VerificationRepository } from './verification.repo';
import { VerificationService } from './verification.service';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([VerificationEntity])],
    controllers: [VerificationController],
    providers: [VerificationRepository, VerificationService],
    exports: [VerificationRepository, VerificationService],
})
export class VerificationModule {}
