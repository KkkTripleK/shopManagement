import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifyDTO } from '../auths/dto/verify.dto';
import { VerificationEntity } from './verification.entity';

@Injectable()
export class VerificationRepository {
  constructor(
    @InjectRepository(VerificationEntity)
    private verificationEntity: Repository<VerificationEntity>,
  ) {}

  saveActiveCode(
    username: string,
    activeCode: string,
  ): Promise<VerificationEntity> {
    return this.verificationEntity.save({ username, activeCode });
  }

  verifyUser(verifyDTO: VerifyDTO): Promise<number> {
    return this.verificationEntity.count({ where: [verifyDTO] });
  }

  async saveToken(
    username: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<VerificationEntity> {
    const userVerification = await this.verificationEntity.findOne({
      where: [{ username }],
    });
    userVerification.accessToken = accessToken;
    userVerification.refreshToken = refreshToken;
    return this.verificationEntity.save(userVerification);
  }
}
