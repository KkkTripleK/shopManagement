import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponUserEntity } from './couponUser.entity';

@Injectable()
export class CouponUserRepository {
  constructor(
    @InjectRepository(CouponUserEntity)
    private couponUserRepo: Repository<CouponUserEntity>,
  ) {}
}
