import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../configs/config.typeorm';
import { VerificationController } from './verification.controller';
import { VerificationRepository } from './verification.repo';
import { VerificationService } from './verification.service';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationRepository],
})
export class AuthModule {}
