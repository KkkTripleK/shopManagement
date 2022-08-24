import { Injectable } from '@nestjs/common';
import { VerifyDTO } from '../auths/dto/verify.dto';
import { VerificationDTO } from './dto/verification.dto';
import { VerificationRepository } from './verification.repo';

@Injectable()
export class VerificationService {
  constructor(private verificationRepository: VerificationRepository) {}

  saveActiveCode(
    username: string,
    activeCode: string,
  ): Promise<VerificationDTO> {
    return this.verificationRepository.saveActiveCode(username, activeCode);
  }

  verifyUser(verifyDTO: VerifyDTO): Promise<number> {
    return this.verificationRepository.verifyUser(verifyDTO);
  }

  saveToken(
    username: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<VerificationDTO> {
    return this.verificationRepository.saveToken(
      username,
      accessToken,
      refreshToken,
    );
  }
}
