import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifyDTO } from '../auths/dto/dto.verify';
import { VerificationEntity } from './verification.entity';

@Injectable()
export class VerificationRepository {
    constructor(
        @InjectRepository(VerificationEntity)
        private verificationEntity: Repository<VerificationEntity>,
    ) {}

    saveActiveCode(username: string, activeCode: string): Promise<VerificationEntity> {
        return this.verificationEntity.save({ username, activeCode });
    }

    verifyUser(verifyDTO: VerifyDTO): Promise<number> {
        return this.verificationEntity.count({ where: [verifyDTO] });
    }
}
